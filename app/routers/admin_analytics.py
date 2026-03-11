from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.models.user import User
from app.models.quiz_result import QuizResult
from app.models.interview import Interview
from app.models.chatbot_log import ChatbotLog

router = APIRouter(prefix="/admin/analytics", tags=["Admin Analytics"])


@router.get("/overview")
def get_system_overview(db: Session = Depends(get_db)):

    total_students = db.query(User).filter(User.role == "student").count()

    interview_count = db.query(Interview).count()

    chatbot_queries = db.query(ChatLog).count()

    return {
        "total_students": total_students,
        "interviews_this_month": interview_count,
        "chatbot_queries": chatbot_queries
    }
    

@router.get("/performance")
def get_performance(db: Session = Depends(get_db)):

    top_students = (
        db.query(User.name, func.avg(QuizResult.score).label("avg_score"))
        .join(QuizResult, QuizResult.student_id == User.id)
        .group_by(User.name)
        .order_by(func.avg(QuizResult.score).desc())
        .limit(10)
        .all()
    )

    return {
        "top_students": [
            {"name": s.name, "score": s.avg_score} for s in top_students
        ]
    }
    

@router.get("/activity")
def get_activity_stats(db: Session = Depends(get_db)):

    interviews = db.query(Interview).count()
    chats = db.query(ChatLog).count()

    return {
        "interviews_conducted": interviews,
        "chatbot_usage": chats
    }