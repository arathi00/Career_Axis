from pydantic import BaseModel, Field
from typing import List


class GenerateCompanyQuestionsRequest(BaseModel):
    """Request to generate bulk questions for a company"""
    company_name: str
    track: str
    exam_type: str
    category: str
    topics: List[str]
    difficulty: str
    questions_per_topic: int = Field(ge=1, le=500, description="Questions to generate per topic")

    class Config:
        json_schema_extra = {
            "example": {
                "company_name": "TCS",
                "track": "Software Engineer",
                "exam_type": "Technical",
                "category": "Arrays",
                "topics": ["Sorting", "Searching", "Two Pointers"],
                "difficulty": "Medium",
                "questions_per_topic": 100
            }
        }


class GenerateCompanyQuestionsResponse(BaseModel):
    """Response after bulk question generation"""
    company_name: str
    total_generated: int
    message: str
    breakdown: dict  # {topic: count}

    class Config:
        from_attributes = True
