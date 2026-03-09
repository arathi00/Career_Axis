from sqlalchemy import Column, Integer, String
from app.database.base import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    domain = Column(String)
    difficulty = Column(String)
    time_limit = Column(Integer)
    description = Column(String)
    status = Column(String, default="active")
    
    