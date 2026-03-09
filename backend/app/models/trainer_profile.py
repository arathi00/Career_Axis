from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class TrainerProfile(Base):
    __tablename__ = "trainer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    qualification = Column(String)
    designation = Column(String)
    expertise = Column(String)
    experience = Column(Integer)
    organization = Column(String)

    user = relationship("User", backref="trainer_profile")
