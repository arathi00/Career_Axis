from sqlalchemy import Column, Integer, String
from app.database.base import Base

class ChatbotLog(Base):
    __tablename__ = "chatbot_logs"

    id = Column(Integer, primary_key=True)
    query = Column(String)
    response = Column(String)
