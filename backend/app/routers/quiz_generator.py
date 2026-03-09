"""
Simple Quiz Generator - Gemini to Database
Generates quiz questions using Gemini and saves directly to PostgreSQL
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

from app.database.session import get_db
from app.models.quiz import Quiz
from app.models.question import Question
from app.services.gemini_service import GeminiQuestionGenerator
from app.utils.logger import logger

router = APIRouter(prefix="/api/quiz-generator", tags=["Quiz Generator"])


# ✅ REQUEST SCHEMA
class SimpleQuizRequest(BaseModel):
    """Simple request for generating quiz"""
    company: str = "TCS"
    topic: str = "Aptitude"
    difficulty: str = "easy"
    num_questions: int = 5


# ✅ RESPONSE SCHEMA
class QuizGenerateResponse(BaseModel):
    """Response after quiz generation"""
    message: str
    quiz_id: int
    questions_saved: int


# 🔥 MAIN ENDPOINT: Generate Quiz and Save to Database
@router.post("/quiz", response_model=QuizGenerateResponse)
def generate_quiz(
    request: SimpleQuizRequest,
    db: Session = Depends(get_db)
):
    """
    Generate quiz using Gemini AI and save to database
    
    Flow:
    1. Create a quiz record
    2. Call Gemini to generate questions
    3. Save questions to database
    4. Return confirmation
    """
    try:
        # 1️⃣ Create Quiz record
        quiz = Quiz(
            company=request.company,
            track="General",  # Default value
            exam_type="Practice",  # Default value
            category=request.topic,
            topic=request.topic,
            difficulty=request.difficulty,
            question_type="MCQ",
            question_count=request.num_questions,
            created_at=datetime.utcnow()
        )
        db.add(quiz)
        db.commit()
        db.refresh(quiz)
        
        logger.info(f"Created quiz with ID: {quiz.id}")
        
        # 2️⃣ Generate questions using Gemini
        gemini_generator = GeminiQuestionGenerator()
        questions_data = gemini_generator.generate_questions(
            company=request.company,
            difficulty=request.difficulty,
            count=request.num_questions,
            topic=request.topic
        )
        
        logger.info(f"Gemini generated {len(questions_data)} questions")
        
        # 3️⃣ Save questions to database
        questions_saved = 0
        for q_data in questions_data:
            question = Question(
                quiz_id=quiz.id,
                company=request.company,
                track="General",
                exam_type="Practice",
                category=request.topic,
                topic=request.topic,
                difficulty=request.difficulty,
                question_type="MCQ",
                question=q_data.get("question_text", ""),
                options=q_data.get("options", []),
                correct_answer=q_data.get("correct_answer", ""),
                explanation=q_data.get("explanation", ""),
                source="Gemini",
                approved=True  # Auto-approve Gemini questions
            )
            db.add(question)
            questions_saved += 1
        
        db.commit()
        
        logger.info(f"Saved {questions_saved} questions for quiz {quiz.id}")
        
        # 4️⃣ Return success response
        return QuizGenerateResponse(
            message=f"Quiz and {questions_saved} questions saved successfully to database",
            quiz_id=quiz.id,
            questions_saved=questions_saved
        )
        
    except Exception as e:
        db.rollback()
        logger.error(f"Quiz generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate and save quiz: {str(e)}"
        )


# 📊 GET Quiz with Questions
@router.get("/quiz/{quiz_id}")
def get_quiz_with_questions(quiz_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a quiz and all its questions from database
    Verifies that data was actually saved
    """
    try:
        # Get quiz
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Get questions
        questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
        
        return {
            "quiz": {
                "id": quiz.id,
                "company": quiz.company,
                "topic": quiz.topic,
                "difficulty": quiz.difficulty,
                "question_count": quiz.question_count,
                "created_at": quiz.created_at.isoformat()
            },
            "questions": [
                {
                    "id": q.id,
                    "question": q.question,
                    "options": q.options,
                    "correct_answer": q.correct_answer,
                    "explanation": q.explanation
                }
                for q in questions
            ],
            "total_questions": len(questions)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
