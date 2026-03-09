from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database.base import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True))
    question_text = Column(String)

    option_a = Column(String)
    option_b = Column(String)
    option_c = Column(String)
    option_d = Column(String)

    correct_answer = Column(String)

    source = Column(String, default="admin")
    status = Column(String, default="approved")