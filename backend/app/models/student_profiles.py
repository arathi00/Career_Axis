from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    university = Column(String)
    college = Column(String)
    course = Column(String)
    branch = Column(String)
    current_year = Column(String)
    graduation_year = Column(Integer)
    cgpa = Column(Float)
    skills = Column(JSON)

    user = relationship("User", backref="student_profile")
