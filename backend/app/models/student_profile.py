from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from app.database.base import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    university = Column(String, nullable=False)
    college = Column(String, nullable=False)
    course = Column(String, nullable=False)
    branch = Column(String, nullable=False)
    current_year = Column(String, nullable=False)
    graduation_year = Column(Integer, nullable=False)
    cgpa = Column(Float, nullable=False)
    skills = Column(ARRAY(String), nullable=True)

    user = relationship("User", back_populates="student_profile")
