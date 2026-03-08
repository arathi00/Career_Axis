from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database.base import Base


class ChatbotLog(Base):
    __tablename__ = "chatbot_logs"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False)  # Stored with user prefix for filtering
    response = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

