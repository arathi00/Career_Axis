from sqlalchemy import Column, Integer, ForeignKey, String
from app.database.base import Base

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    feedback = Column(String)
