from sqlalchemy import Column, Integer, String, JSON, Boolean
from app.database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # student | trainer | admin

    academic_details = Column(JSON, nullable=True)
    trainer_details = Column(JSON, nullable=True)

    is_approved = Column(Boolean, default=False)
