"""
Company Quiz Router - Handles all company-specific quiz operations
Integrates with Gemini API for dynamic question generation
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import logging
from datetime import datetime

from app.database.session import get_db
from app.schemas.company_quiz import (
    QuizStartRequest, QuizStartResponse, QuestionResponse,
    QuizCompleteRequest, QuizResultResponse, AnswerDetail,
    CompanyCreate, CompanyResponse, QuizSessionHistory, TimingMetrics,
    SubmitTimingMetrics
)
from app.models.company_quiz import (
    Company, QuizLevel, CompanyQuestion, QuizSession, 
    SessionAnswer, DifficultyLevel
)
from app.models.user import User
from app.core.dependencies import get_current_user
from app.services.gemini_service import gemini_generator
from app.utils.timing import PerformanceTimer

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/company-quiz", tags=["Company Quiz"])


# ============= COMPANY MANAGEMENT =============

@router.post("/companies", response_model=CompanyResponse)
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db)
):
    """Create a new company (Admin only)"""
    # Check if company already exists
    existing = db.query(Company).filter(Company.name == company.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Company already exists")
    
    db_company = Company(
        name=company.name,
        description=company.description
    )
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    
    # Create quiz levels for this company
    for level in DifficultyLevel:
        quiz_level = QuizLevel(company_id=db_company.id, level=level)
        db.add(quiz_level)
    
    db.commit()
    logger.info(f"Created company: {company.name}")
    return db_company


@router.get("/companies", response_model=List[CompanyResponse])
def get_all_companies(db: Session = Depends(get_db)):
    """Get all available companies"""
    companies = db.query(Company).all()
    return companies


# ============= QUIZ START (MAIN ENDPOINT) =============

@router.post("/start", response_model=QuizStartResponse)
def start_quiz(
    request: QuizStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    🚀 START QUIZ - Main Endpoint with Performance Timing
    
    This endpoint:
    1. Checks if company exists
    2. Gets or creates quiz level
    3. Checks if enough questions exist in DB ⏱️ (measured)
    4. If not enough questions → Calls Gemini API ⏱️ (measured)
    5. Stores new questions in DB ⏱️ (measured)
    6. Creates quiz session
    7. Returns questions to frontend with timing metrics
    
    Responds with timing for:
    - Database fetch operations
    - Gemini API calls (if generating new questions)
    - Database store operations
    - Total end-to-end time
    """
    
    # Initialize performance timer
    timer = PerformanceTimer()
    timer.start("total")
    api_call_time = None
    from_cache = True
    
    # Step 1: Validate company
    company = db.query(Company).filter(Company.name == request.company).first()
    if not company:
        # Auto-create company if it doesn't exist
        company = Company(name=request.company, description=f"{request.company} placement exams")
        db.add(company)
        db.commit()
        db.refresh(company)
        logger.info(f"Auto-created company: {request.company}")
    
    # Step 2: Get or create quiz level
    quiz_level = db.query(QuizLevel).filter(
        QuizLevel.company_id == company.id,
        QuizLevel.level == request.level
    ).first()
    
    if not quiz_level:
        quiz_level = QuizLevel(company_id=company.id, level=request.level)
        db.add(quiz_level)
        db.commit()
        db.refresh(quiz_level)
    
    # Step 3: Check existing questions count (with timing)
    timer.start("db_fetch")
    existing_count = db.query(CompanyQuestion).filter(
        CompanyQuestion.company_id == company.id,
        CompanyQuestion.level_id == quiz_level.id
    ).count()
    db_fetch_time = timer.end("db_fetch")
    
    logger.info(f"✅ Found {existing_count} existing questions for {request.company} - {request.level} ({db_fetch_time:.2f}ms)")
    
    # Step 4: Generate more questions if needed (with timing)
    if existing_count < request.count:
        from_cache = False
        questions_needed = request.count - existing_count
        logger.info(f"🔥 Generating {questions_needed} new questions via Gemini API...")
        
        try:
            # CALL GEMINI API - WITH TIMING
            timer.start("api_call")
            generated_questions = gemini_generator.generate_questions(
                company=request.company,
                difficulty=request.level.value,
                count=questions_needed,
                topic=request.topic
            )
            api_call_time = timer.end("api_call")
            logger.info(f"✅ Gemini API generated {len(generated_questions)} questions ({api_call_time:.2f}ms)")
            
            # Step 5: Store generated questions in database (with timing)
            timer.start("db_store")
            for q_data in generated_questions:
                db_question = CompanyQuestion(
                    company_id=company.id,
                    level_id=quiz_level.id,
                    question_text=q_data["question_text"],
                    options=q_data["options"],
                    correct_answer=q_data["correct_answer"],
                    explanation=q_data.get("explanation", ""),
                    source="gemini"
                )
                db.add(db_question)
            
            db.commit()
            db_store_time = timer.end("db_store")
            logger.info(f"✅ Stored {len(generated_questions)} new questions in DB ({db_store_time:.2f}ms)")
            
        except Exception as e:
            logger.error(f"❌ Gemini API error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate questions: {str(e)}"
            )
    else:
        # Questions were already cached - no API call needed
        db_store_time = 0
        logger.info(f"📦 Using cached questions ({db_fetch_time:.2f}ms to retrieve)")
    
    # Step 6: Fetch questions for this quiz session
    timer.start("db_fetch_final")
    questions = db.query(CompanyQuestion).filter(
        CompanyQuestion.company_id == company.id,
        CompanyQuestion.level_id == quiz_level.id
    ).order_by(func.random()).limit(request.count).all()
    db_fetch_final_time = timer.end("db_fetch_final")
    
    if len(questions) < request.count:
        raise HTTPException(
            status_code=500,
            detail=f"Could not retrieve enough questions. Found {len(questions)}, needed {request.count}"
        )
    
    # Step 7: Create quiz session
    quiz_session = QuizSession(
        company_id=company.id,
        level_id=quiz_level.id,
        user_id=current_user.id if current_user else None,
        total_questions=request.count,
        status="active"
    )
    db.add(quiz_session)
    db.commit()
    db.refresh(quiz_session)
    
    # Step 8: Prepare response (hide correct answers)
    question_responses = [
        QuestionResponse(
            id=q.id,
            question_text=q.question_text,
            options=q.options
        )
        for q in questions
    ]
    
    # Calculate timing metrics
    total_time = timer.end("total")
    
    # Create timing metrics object
    timing_metrics = TimingMetrics(
        db_fetch_ms=db_fetch_time,
        api_call_ms=api_call_time,
        db_store_ms=db_store_time,
        total_time_ms=total_time,
        from_cache=from_cache
    )
    
    # Log performance summary
    timer.log_summary()
    logger.info(
        f"📊 Quiz Start Summary: "
        f"DB Fetch={db_fetch_time:.0f}ms, "
        f"API Call={'N/A' if api_call_time is None else f'{api_call_time:.0f}ms'}, "
        f"DB Store={db_store_time:.0f}ms, "
        f"Total={total_time:.0f}ms, "
        f"Cached={from_cache}"
    )
    
    logger.info(f"✅ Quiz session {quiz_session.id} started for user {current_user.id if current_user else 'guest'}")
    
    return QuizStartResponse(
        session_id=quiz_session.id,
        company=request.company,
        level=request.level.value,
        total_questions=request.count,
        questions=question_responses,
        started_at=quiz_session.started_at,
        timing=timing_metrics
    )


# ============= QUIZ SUBMISSION =============

@router.post("/submit", response_model=QuizResultResponse)
def submit_quiz(
    request: QuizCompleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit quiz and get results with performance timing"""
    
    # Initialize performance timer
    timer = PerformanceTimer()
    timer.start("total")
    
    # Validate session
    session = db.query(QuizSession).filter(QuizSession.id == request.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    
    if session.status == "completed":
        raise HTTPException(status_code=400, detail="Quiz already completed")
    
    # Process answers (with timing)
    timer.start("evaluation")
    score = 0
    answer_details = []
    
    for answer in request.answers:
        question = db.query(CompanyQuestion).filter(
            CompanyQuestion.id == answer.question_id
        ).first()
        
        if not question:
            continue
        
        is_correct = answer.selected_answer == question.correct_answer
        if is_correct:
            score += 1
        
        # Prepare answer detail
        answer_details.append(AnswerDetail(
            question_id=question.id,
            question_text=question.question_text,
            options=question.options,
            selected_answer=answer.selected_answer,
            correct_answer=question.correct_answer,
            is_correct=is_correct,
            explanation=question.explanation
        ))
    
    evaluation_time = timer.end("evaluation")
    logger.info(f"✅ Evaluated {len(request.answers)} answers ({evaluation_time:.2f}ms)")
    
    # Store answers in database (with timing)
    timer.start("db_store")
    for answer, answer_detail in zip(request.answers, answer_details):
        session_answer = SessionAnswer(
            session_id=session.id,
            question_id=answer.question_id,
            selected_answer=answer.selected_answer,
            is_correct=1 if answer_detail.is_correct else 0,
            answered_at=datetime.utcnow()
        )
        db.add(session_answer)
    
    # Update session
    session.score = score
    session.completed_at = datetime.utcnow()
    session.status = "completed"
    db.commit()
    
    db_store_time = timer.end("db_store")
    logger.info(f"✅ Stored results in DB ({db_store_time:.2f}ms)")
    
    percentage = (score / session.total_questions) * 100
    total_time = timer.end("total")
    
    # Create timing metrics
    submit_timing = SubmitTimingMetrics(
        evaluation_ms=evaluation_time,
        db_store_ms=db_store_time,
        total_time_ms=total_time
    )
    
    # Log performance summary
    logger.info(
        f"📊 Quiz Submit Summary: "
        f"Evaluation={evaluation_time:.0f}ms, "
        f"DB Store={db_store_time:.0f}ms, "
        f"Total={total_time:.0f}ms, "
        f"Score={score}/{session.total_questions}"
    )
    
    return QuizResultResponse(
        session_id=session.id,
        company=session.company.name,
        level=session.quiz_level.level.value,
        score=score,
        total=session.total_questions,
        percentage=round(percentage, 2),
        status="completed",
        completed_at=session.completed_at,
        answers=answer_details,
        timing=submit_timing
    )


# ============= USER HISTORY =============

@router.get("/history", response_model=List[QuizSessionHistory])
def get_quiz_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get quiz history for current user"""
    sessions = db.query(QuizSession).filter(
        QuizSession.user_id == current_user.id
    ).order_by(QuizSession.started_at.desc()).all()
    
    history = []
    for session in sessions:
        percentage = None
        if session.score is not None:
            percentage = round((session.score / session.total_questions) * 100, 2)
        
        history.append(QuizSessionHistory(
            id=session.id,
            company=session.company.name,
            level=session.quiz_level.level.value,
            score=session.score,
            total_questions=session.total_questions,
            percentage=percentage,
            status=session.status,
            started_at=session.started_at,
            completed_at=session.completed_at
        ))
    
    return history
