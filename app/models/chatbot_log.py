from sqlalchemy import Column, Integer, Text, DateTime
from sqlalchemy.sql import func
from app.database.base import Base


class ChatbotLog(Base):
    __tablename__ = "chatbot_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer)
    query = Column(Text)
    response = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())