from sqlalchemy import Column, Integer, String
from app.database.base import Base

class Dashboard(Base):
    __tablename__ = "dashboards"

    id = Column(Integer, primary_key=True)
    summary = Column(String)
