from sqlalchemy import Column, Integer, String, Date, Time, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)

    trainer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # booked later

    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)

    position = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)

    status = Column(String(20), default="available")  
    # available | booked | completed

    trainer = relationship("User", foreign_keys=[trainer_id])
    student = relationship("User", foreign_keys=[student_id])

    join_link = Column(String, nullable=True)
    feedback = Column(Text, nullable=True)
    feedback_score = Column(Integer, nullable=True)
