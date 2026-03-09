from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.ai_quiz import GenerateQuizRequest
from app.services.quiz_ai import generate_quiz_questions

router = APIRouter(prefix="/quiz", tags=["Quiz"])


@router.post("/generate-ai")
def generate_ai_questions(data: GenerateQuizRequest, db: Session = Depends(get_db)):

    questions = generate_quiz_questions(
        data.domain,
        data.difficulty,
        data.count
    )

    return {
        "generated_questions": questions
    }