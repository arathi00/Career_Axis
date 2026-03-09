from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base


class QuizResult(Base):
    """Store quiz submission and evaluation results"""
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)  # Nullable for anonymous
    score = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    percentage = Column(Integer, nullable=False)
    answers = Column(JSON, nullable=False)  # {question_id: selected_answer}
    question_timings = Column(JSON, nullable=True)  # {question_id: seconds_spent}
    started_at = Column(DateTime, default=datetime.utcnow, index=True)
    finished_at = Column(DateTime, default=datetime.utcnow, index=True)
    submitted_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="results")


class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    quiz_result_id = Column(Integer, ForeignKey("quiz_results.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_answer = Column(String, nullable=False)
    is_correct = Column(Integer, default=0)  # 1 for correct, 0 for wrong
    created_at = Column(DateTime, default=datetime.utcnow)
