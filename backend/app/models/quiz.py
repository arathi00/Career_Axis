from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base
from app.models.quiz_result import QuizResult


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False, index=True)
    track = Column(String, nullable=False)
    exam_type = Column(String, nullable=False)
    category = Column(String, nullable=False)
    topic = Column(String, nullable=False, index=True)
    difficulty = Column(String, nullable=False)
    question_type = Column(String, nullable=False, default="MCQ", server_default="MCQ")
    question_count = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    results = relationship("QuizResult", back_populates="quiz", cascade="all, delete-orphan")
