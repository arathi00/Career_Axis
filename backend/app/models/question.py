from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey
from datetime import datetime
from app.database.base import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=True, index=True)  # Null = bank question
    
    # Metadata
    company = Column(String, index=True, nullable=False)
    track = Column(String, nullable=False)
    exam_type = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    topic = Column(String, nullable=False, index=True)
    difficulty = Column(String, nullable=False)
    question_type = Column(String, nullable=False, default="MCQ", server_default="MCQ")

    # Content
    question = Column(String, nullable=False)
    options = Column(JSON, nullable=False)
    correct_answer = Column(String, nullable=False)
    explanation = Column(String)

    source = Column(String, default="AI")
    approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
