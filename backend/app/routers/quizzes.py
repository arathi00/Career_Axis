from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.schemas.quiz import (
    AIQuestionRequest,
    CompanySchema,
    ExamTypeResponse,
    CategoryResponse,
    TopicResponse,
    QuestionBankStatsResponse,
    QuizCreateResponse,
    QuizFetchResponse,
    QuizSubmitRequest,
    QuizResultResponse,
    QuizResultDetailResponse,
    QuestionResult,
    QuizListResponse,
    QuestionView,
    QuestionWithAnswer,
    BankQuizGenerateRequest,
    BankQuizGenerateResponse
)
from app.schemas.question_generation import (
    GenerateCompanyQuestionsRequest,
    GenerateCompanyQuestionsResponse
)
from app.services.quiz_ai import generate_ai_questions
from app.services.ai_question_generator import generate_questions_for_company
from app.services.question_bank_service import question_bank_service
from app.database.session import get_db
from app.core.dependencies import admin_required
from app.models.quiz import Quiz
from app.models.quiz_result import QuizResult
from app.models.question import Question
from app.utils.logger import logger
from app.utils.question_bank import get_company_tracks, get_categories_for_company

# ✅ DEFINE ROUTER
router = APIRouter(
    prefix="/api/quizzes",
    tags=["Quizzes"]
)


# ✅ GENERATE QUIZ (AI)
@router.post("/ai-generate", response_model=QuizCreateResponse)
def ai_generate_questions(
    request: AIQuestionRequest,
    db: Session = Depends(get_db),
    _: str = Depends(admin_required)
):
    """
    Generate AI quiz with validation against question bank
    Only generates AI questions if database doesn't have enough
    """
    try:
        # Validate request against question bank
        validation = question_bank_service.validate_quiz_request(
            db=db,
            company=request.company,
            track=request.track,
            exam_type=request.exam_type,
            category=request.category,
            topic=request.topic,
            num_questions=request.num_questions
        )
        
        if not validation["valid"]:
            raise HTTPException(status_code=400, detail=validation["message"])
        
        logger.info(
            f"Quiz validation: {validation['db_count']} in DB, "
            f"AI needed: {validation['needs_ai']}, "
            f"will generate: {validation.get('ai_generate_count', 0)}"
        )
        
        # Generate quiz (uses DB questions + AI if needed)
        quiz = generate_ai_questions(request, db)
        
        return QuizCreateResponse(
            quiz_id=quiz.id,
            message="Quiz generated successfully",
            num_questions=request.num_questions
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Quiz generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")


# ✅ BULK GENERATE QUESTIONS (Admin Only)
@router.post(
    "/generate/company",
    response_model=GenerateCompanyQuestionsResponse,
    summary="Generate Company Specific Questions (AI)",
    description="Generate large-scale company specific questions using AI (Admin only)",
    dependencies=[Depends(admin_required)]
)
def generate_company_questions(
    payload: GenerateCompanyQuestionsRequest,
    db: Session = Depends(get_db)
):
    """
    Generate bulk questions for a company across multiple topics
    Example: 6 topics × 350 questions = 2100 questions in one call
    """
    try:
        logger.info(
            f"Starting bulk generation: {payload.company_name} - "
            f"{len(payload.topics)} topics × {payload.questions_per_topic} questions"
        )
        
        total_generated, breakdown = generate_questions_for_company(
            company=payload.company_name,
            track=payload.track,
            exam_type=payload.exam_type,
            category=payload.category,
            topics=payload.topics,
            difficulty=payload.difficulty,
            questions_per_topic=payload.questions_per_topic,
            db=db
        )
        
        logger.info(f"Bulk generation completed: {total_generated} questions")
        
        return GenerateCompanyQuestionsResponse(
            company_name=payload.company_name,
            total_generated=total_generated,
            message=f"Successfully generated {total_generated} questions",
            breakdown=breakdown
        )
        
    except Exception as e:
        logger.error(f"Bulk generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Bulk generation failed: {str(e)}"
        )


# ✅ GET AVAILABLE COMPANIES & TRACKS
@router.get(
    "/companies",
    response_model=List[CompanySchema],
    summary="Get Companies",
    description="Get all available companies with tracks from question bank"
)
def get_companies():
    """Get all available companies with tracks from question bank"""
    return question_bank_service.get_all_companies()


# ✅ GET EXAM TYPES FOR COMPANY
@router.get(
    "/companies/{company_name}/exam-types",
    response_model=ExamTypeResponse,
    summary="Get Exam Types",
    description="Get available exam types for a company"
)
def get_exam_types(company_name: str):
    """Get available exam types for a company"""
    exam_types = question_bank_service.get_exam_types(company_name)
    if not exam_types:
        raise HTTPException(status_code=404, detail=f"Company '{company_name}' not found")
    return {"company_name": company_name, "exam_types": exam_types}

# ✅ GET CATEGORIES FOR COMPANY
@router.get(
    "/companies/{company_name}/categories",
    response_model=CategoryResponse,
    summary="Get Company Categories",
    description="Get available categories for a company and optional exam type"
)
def get_company_categories(company_name: str, exam_type: Optional[str] = Query(None)):
    """Get available categories for a company and optional exam type"""
    categories = question_bank_service.get_categories(company_name, exam_type)
    if not categories:
        raise HTTPException(status_code=404, detail=f"Company '{company_name}' not found")

    category_names = [cat.get("category") for cat in categories if cat.get("category")]

    if not category_names:
        raise HTTPException(status_code=404, detail="No categories found")

    return {
        "company_name": company_name,
        "exam_type": exam_type,
        "categories": category_names
    }


# ✅ GET TOPICS WITH QUESTION COUNTS
@router.get(
    "/companies/{company_name}/topics",
    response_model=TopicResponse,
    summary="Get Topics",
    description="Get available topics with question counts for a category"
)
def get_topics(
    company_name: str,
    track: str = Query(...),
    exam_type: str = Query(...),
    category: str = Query(...),
    db: Session = Depends(get_db)
):
    """Get available topics with question counts for a category"""
    topics = question_bank_service.get_available_topics(
        db=db,
        company=company_name,
        track=track,
        exam_type=exam_type,
        category=category
    )

    if not topics:
        raise HTTPException(status_code=404, detail="No topics found")

    # Normalize to expected schema keys
    normalized = [
        {
            "topic": item.get("topic"),
            "question_count": item.get("count", 0)
        }
        for item in topics
        if item.get("topic")
    ]

    if not normalized:
        raise HTTPException(status_code=404, detail="No topics found")

    return {
        "company_name": company_name,
        "track": track,
        "exam_type": exam_type,
        "category": category,
        "topics": normalized
    }


# ✅ GET QUESTION BANK STATISTICS
@router.get(
    "/stats",
    response_model=QuestionBankStatsResponse,
    summary="Get Question Bank Stats",
    description="Get question bank statistics - shows configured vs actual questions (Admin only)",
    dependencies=[Depends(admin_required)]
)
def get_question_bank_stats(db: Session = Depends(get_db)):
    """Get question bank statistics - shows configured vs actual questions (Admin only)"""
    stats = question_bank_service.get_question_bank_stats(db)

    total_db = stats.get("total_questions_in_db", 0)
    configured = stats.get("total_configured_questions", 0)
    active = total_db  # treating all stored questions as active
    inactive = max(0, configured - total_db)

    return {
        "total_questions": total_db,
        "active_questions": active,
        "inactive_questions": inactive
    }


# ✅ GET COMPANY QUESTION COUNTS (For Frontend Display)
@router.get("/bank/company-stats")
def get_company_stats(db: Session = Depends(get_db)):
    """Get actual question counts from database for each company (for displaying on frontend)"""
    try:
        # Query distinct companies and their question counts
        from sqlalchemy import func
        
        company_stats = db.query(
            Question.company,
            func.count(Question.id).label("count")
        ).filter(
            Question.quiz_id == None  # Only bank questions
        ).group_by(Question.company).all()
        
        # Format response
        companies = []
        for company, count in company_stats:
            # Get exam types for this company from question_bank_service
            exam_types = question_bank_service.get_exam_types(company)
            
            companies.append({
                "name": company,
                "totalQuestions": count,
                "tags": exam_types if exam_types else [],
                "overview": f"{company} - Practice questions"
            })
        
        # Sort by name
        companies.sort(key=lambda x: x["name"])
        
        return {"companies": companies}
    
    except Exception as e:
        logger.error(f"Failed to get company stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get company stats: {str(e)}")


# ✅ GET AVAILABLE QUESTIONS BY COMPANY & EXAM TYPE & DIFFICULTY
@router.get("/bank/{company}/available-quizzes")
def get_available_quizzes(
    company: str,
    exam_type: str = Query(...),
    db: Session = Depends(get_db)
):
    """Get available questions grouped by difficulty for a company and exam type"""
    try:
        from sqlalchemy import func
        
        # Query available questions grouped by difficulty
        results = db.query(
            Question.difficulty,
            func.count(Question.id).label("count")
        ).filter(
            Question.quiz_id == None,
            Question.company == company,
            Question.exam_type == exam_type
        ).group_by(Question.difficulty).all()
        
        if not results:
            return {
                "company": company,
                "exam_type": exam_type,
                "difficulties": []
            }
        
        difficulties = [
            {
                "level": difficulty,
                "count": count
            }
            for difficulty, count in results
        ]
        
        return {
            "company": company,
            "exam_type": exam_type,
            "difficulties": difficulties
        }
    
    except Exception as e:
        logger.error(f"Failed to get available quizzes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get available quizzes: {str(e)}")


# ✅ GENERATE QUIZ FROM BANK QUESTIONS
@router.post("/bank/generate", response_model=BankQuizGenerateResponse)
def generate_bank_quiz(
    request: BankQuizGenerateRequest,
    db: Session = Depends(get_db)
):
    """Generate a quiz from bank questions for student assessments"""
    try:
        # Query available bank questions matching criteria
        questions = db.query(Question).filter(
            Question.quiz_id == None,  # Bank questions
            Question.company == request.company,
            Question.exam_type == request.exam_type,
            Question.difficulty == request.difficulty
        ).limit(request.num_questions).all()
        
        if not questions:
            raise HTTPException(
                status_code=404,
                detail=f"No questions found for {request.company} - {request.exam_type} - {request.difficulty}"
            )
        
        # Transform to response format
        question_list = [
            {
                "id": q.id,
                "question": q.question,
                "options": q.options,
                "correct_answer": q.correct_answer,
                "explanation": q.explanation or f"The correct answer is: {q.correct_answer}"
            }
            for q in questions
        ]
        
        return BankQuizGenerateResponse(
            questions=question_list,
            total=len(question_list),
            company=request.company,
            exam_type=request.exam_type,
            difficulty=request.difficulty
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate bank quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate bank quiz: {str(e)}")


# ✅ FETCH QUIZ (No answers shown)
@router.get("/{quiz_id}", response_model=QuizFetchResponse)
def fetch_quiz(quiz_id: int, db: Session = Depends(get_db)):
    """Fetch quiz to take (no correct answers exposed)"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    
    question_views = [
        QuestionView(
            question_id=q.id,
            question=q.question,
            options=q.options
        )
        for q in questions
    ]
    
    return QuizFetchResponse(
        quiz_id=quiz.id,
        company=quiz.company,
        track=quiz.track,
        topic=quiz.topic,
        difficulty=quiz.difficulty,
        question_type=quiz.question_type,
        question_count=quiz.question_count,
        questions=question_views
    )


# ✅ SUBMIT QUIZ ANSWERS
@router.post("/{quiz_id}/submit", response_model=QuizResultResponse)
def submit_quiz(quiz_id: int, request: QuizSubmitRequest, db: Session = Depends(get_db)):
    """Submit answers and get evaluation"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Fetch all questions for this quiz
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    question_map = {q.id: q for q in questions}
    
    # Evaluate answers
    score = 0
    answers_dict = {}
    question_timings = {}  # Store time spent on each question
    for answer_item in request.answers:
        q_id = answer_item.question_id
        selected = answer_item.selected_answer
        answers_dict[str(q_id)] = selected
        
        # Store timing if provided
        if answer_item.time_spent is not None:
            question_timings[str(q_id)] = answer_item.time_spent
        
        if q_id in question_map:
            if question_map[q_id].correct_answer == selected:
                score += 1
    
    total = len(request.answers)
    percentage = int((score / total * 100)) if total > 0 else 0
    start_time = request.started_at or datetime.utcnow()
    finish_time = datetime.utcnow()
    
    # Calculate total time
    total_time_seconds = None
    if request.total_time_seconds:
        total_time_seconds = request.total_time_seconds
    elif start_time and finish_time:
        total_time_seconds = int((finish_time - start_time).total_seconds())
    
    # Store result
    result = QuizResult(
        quiz_id=quiz_id,
        user_id=None,  # Anonymous for now (can add user context later)
        score=score,
        total=total,
        percentage=percentage,
        answers=answers_dict,
        question_timings=question_timings if question_timings else None,
        started_at=start_time,
        submitted_at=finish_time,
        finished_at=finish_time
    )
    db.add(result)
    db.commit()
    
    # Return result with correct answers
    questions_with_answers = [
        QuestionWithAnswer(
            question_id=q.id,
            question=q.question,
            options=q.options,
            correct_answer=q.correct_answer,
            explanation=q.explanation
        )
        for q in questions
    ]
    
    return QuizResultResponse(
        quiz_id=quiz_id,
        score=score,
        total=total,
        percentage=percentage,
        started_at=start_time,
        finished_at=finish_time,
        total_time_seconds=total_time_seconds,
        questions=questions_with_answers
    )


# ✅ GET QUIZ RESULT (Historical)
@router.get(
    "/{quiz_id}/result/{result_id}",
    response_model=QuizResultDetailResponse,
    summary="Get Quiz Result",
    description="Get a stored quiz result with detailed answers"
)
def get_quiz_result(quiz_id: int, result_id: int, db: Session = Depends(get_db)):
    """Get a stored quiz result"""
    result = db.query(QuizResult).filter(
        QuizResult.id == result_id,
        QuizResult.quiz_id == quiz_id
    ).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    
    # Get user's answers from stored JSON
    user_answers = result.answers or {}
    
    question_results = []
    correct_count = 0
    
    for q in questions:
        user_answer = user_answers.get(str(q.id))
        is_correct = user_answer == q.correct_answer
        if is_correct:
            correct_count += 1
        
        question_results.append(
            QuestionResult(
                question_id=q.id,
                question=q.question,
                selected_option=user_answer,
                correct_option=q.correct_answer,
                is_correct=is_correct
            )
        )
    
    total = len(questions)
    wrong_count = total - correct_count
    started_at = result.started_at or result.submitted_at
    finished_at = result.finished_at or result.submitted_at
    
    return QuizResultDetailResponse(
        quiz_id=quiz_id,
        result_id=result_id,
        user_id=result.user_id,
        score=result.score,
        total_questions=total,
        correct_answers=correct_count,
        wrong_answers=wrong_count,
        percentage=result.percentage,
        started_at=started_at,
        submitted_at=result.submitted_at,
        finished_at=finished_at,
        results=question_results
    )


# ✅ LIST ALL QUIZZES (For admin/analytics)
@router.get("")
def list_quizzes(
    company: str = None,
    track: str = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List all quizzes with optional filtering"""
    query = db.query(Quiz)
    
    if company:
        query = query.filter(Quiz.company == company)
    if track:
        query = query.filter(Quiz.track == track)
    
    quizzes = query.offset(skip).limit(limit).all()
    return [
        {
            "id": q.id,
            "company": q.company,
            "track": q.track,
            "topic": q.topic,
            "difficulty": q.difficulty,
            "question_count": q.question_count,
            "created_at": q.created_at.isoformat()
        }
        for q in quizzes
    ]

    
    # Save individual answers
    for answer_item in request.answers:
        question = question_map.get(answer_item.question_id)
        if question:
            is_correct = answer_item.selected_answer == question.correct_answer
            user_answer = UserAnswer(
                quiz_result_id=result.id,
                question_id=answer_item.question_id,
                selected_answer=answer_item.selected_answer,
                is_correct=1 if is_correct else 0
            )
            db.add(user_answer)
    
    db.commit()
    
    return QuizResultResponse(
        quiz_id=request.quiz_id,
        score=score,
        total=total,
        percentage=percentage,
        questions=answers_with_feedback
    )


# ✅ LIST ALL QUIZZES (For admin/analytics)
@router.get(
    "",
    response_model=QuizListResponse,
    summary="List Quizzes",
    description="List all quizzes with optional filtering and pagination"
)
def list_quizzes(
    company: Optional[str] = Query(None),
    track: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List all quizzes with optional filtering"""
    query = db.query(Quiz)
    
    if company:
        query = query.filter(Quiz.company == company)
    if track:
        query = query.filter(Quiz.track == track)
    
    total = query.count()
    quizzes = query.order_by(Quiz.created_at.desc()).offset(skip).limit(limit).all()
    
    return QuizListResponse(
        total=total,
        skip=skip,
        limit=limit,
        quizzes=[
            {
                "quiz_id": q.id,
                "company": q.company,
                "track": q.track,
                "exam_type": q.exam_type,
                "category": q.category,
                "topic": q.topic,
                "difficulty": q.difficulty,
                "total_questions": q.question_count,
                "created_at": q.created_at
            }
            for q in quizzes
        ]
    )

