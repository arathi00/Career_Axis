from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.quiz import Quiz
from app.models.question import Question
from app.core.dependencies import require_role
from app.schemas.quiz import QuizCreate, QuestionCreate, GenerateRequest

router = APIRouter(prefix="/admin", tags=["Admin Quiz"])


# -------------------------------------------------------
# CREATE QUIZ
# -------------------------------------------------------

@router.post("/quizzes")
def create_quiz(
    data: QuizCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    quiz = Quiz(
        title=data.title,
        domain=data.domain,
        difficulty=data.difficulty,
        description=data.description,
        time_limit=data.time_limit,
        status="Active"
    )

    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return quiz


# -------------------------------------------------------
# GET ALL QUIZZES
# -------------------------------------------------------

@router.get("/quizzes")
def get_quizzes(
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    quizzes = db.query(Quiz).all()

    result = []

    for quiz in quizzes:
        result.append({
            "id": quiz.id,
            "title": quiz.title,
            "domain": quiz.domain,
            "difficulty": quiz.difficulty,
            "description": quiz.description,
            "time_limit": quiz.time_limit,
            "status": quiz.status
        })

    return result


# -------------------------------------------------------
# GET QUIZ BY ID
# -------------------------------------------------------

@router.get("/quizzes/{quiz_id}")
def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return quiz


# -------------------------------------------------------
# DISABLE QUIZ
# -------------------------------------------------------

@router.put("/quizzes/{quiz_id}/disable")
def disable_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    quiz.status = "Disabled"

    db.commit()

    return {"message": "Quiz disabled successfully"}


# -------------------------------------------------------
# DELETE QUIZ
# -------------------------------------------------------

@router.delete("/quizzes/{quiz_id}")
def delete_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    db.delete(quiz)
    db.commit()

    return {"message": "Quiz deleted successfully"}


# -------------------------------------------------------
# ADD QUESTION
# -------------------------------------------------------

@router.post("/questions")
def add_question(
    data: QuestionCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    quiz = db.query(Quiz).filter(Quiz.id == data.quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    question = Question(
        quiz_id=data.quiz_id,
        question_text=data.question_text,
        option_a=data.option_a,
        option_b=data.option_b,
        option_c=data.option_c,
        option_d=data.option_d,
        correct_answer=data.correct_answer,
        source="Admin",
        status="Approved"
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return question


# -------------------------------------------------------
# GET QUESTIONS FOR A QUIZ
# -------------------------------------------------------

@router.get("/quizzes/{quiz_id}/questions")
def get_quiz_questions(
    quiz_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()

    return questions


# -------------------------------------------------------
# APPROVE QUESTION
# -------------------------------------------------------

@router.put("/questions/{question_id}/approve")
def approve_question(
    question_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    question = db.query(Question).filter(Question.id == question_id).first()

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    question.status = "Approved"

    db.commit()

    return {"message": "Question approved"}


# -------------------------------------------------------
# REJECT QUESTION
# -------------------------------------------------------

@router.put("/questions/{question_id}/reject")
def reject_question(
    question_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    question = db.query(Question).filter(Question.id == question_id).first()

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    question.status = "Rejected"

    db.commit()

    return {"message": "Question rejected"}


# -------------------------------------------------------
# GENERATE AI QUESTIONS
# -------------------------------------------------------

@router.post("/generate-questions")
def generate_questions(
    data: GenerateRequest,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    generated_questions = []

    for i in range(data.count):

        question = Question(
            quiz_id=None,
            question_text=f"Sample AI Question {i+1} for {data.domain}",
            option_a="Option A",
            option_b="Option B",
            option_c="Option C",
            option_d="Option D",
            correct_answer="A",
            source="AI",
            status="Pending"
        )

        db.add(question)
        generated_questions.append(question)

    db.commit()

    return {
        "message": "AI questions generated",
        "count": len(generated_questions)
    }