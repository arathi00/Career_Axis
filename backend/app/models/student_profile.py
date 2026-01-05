from sqlalchemy import Column, Integer, String, Float, ForeignKey, ARRAY
from app.database.base import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    university = Column(String, nullable=False)
    college = Column(String, nullable=False)
    course = Column(String, nullable=False)
    branch = Column(String, nullable=False)
    # use snake_case column names so they map to the DB columns
    # (avoid forcing a different column name which may not exist)
    current_year = Column(String, nullable=False)
    graduation_year = Column(Integer, nullable=False)
    cgpa = Column(Float, nullable=False)
    skills = Column(ARRAY(String), nullable=True)
