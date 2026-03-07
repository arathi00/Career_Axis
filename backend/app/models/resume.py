from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import relationship
from app.database.base import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    # Career Objective
    job_role = Column(String)
    key_strength = Column(String)
    domain = Column(String)

    # Skills
    technical_skills = Column(JSONB)
    tools = Column(JSONB)

    # Internship / Training
    internships = Column(JSONB)

    # Other sections
    certifications = Column(JSONB)
    achievements = Column(JSONB)
    languages = Column(JSONB)

    # Contact info
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)

    # Generated PDF location
    file_path = Column(String)

    user = relationship("User", back_populates="resume")
