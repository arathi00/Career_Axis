"""
Pydantic schemas for company-specific quiz system
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class DifficultyLevel(str, Enum):
    """Quiz difficulty levels"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuizStatus(str, Enum):
    """Quiz session status"""
    ACTIVE = "active"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


# ============= Performance Timing Schemas =============

class TimingMetrics(BaseModel):
    """Timing metrics for question loading and processing"""
    db_fetch_ms: float = Field(..., description="Time to fetch from database (ms)")
    api_call_ms: Optional[float] = Field(None, description="Time for Gemini API call (ms)")
    db_store_ms: float = Field(..., description="Time to store questions in database (ms)")
    total_time_ms: float = Field(..., description="Total time from request start to response (ms)")
    from_cache: bool = Field(..., description="Whether questions were from cache or freshly generated")
    
    class Config:
        json_schema_extra = {
            "example": {
                "db_fetch_ms": 45.23,
                "api_call_ms": None,
                "db_store_ms": 0,
                "total_time_ms": 98.45,
                "from_cache": True
            }
        }


class SubmitTimingMetrics(BaseModel):
    """Timing metrics for quiz submission"""
    evaluation_ms: float = Field(..., description="Time to evaluate answers (ms)")
    db_store_ms: float = Field(..., description="Time to store results (ms)")
    total_time_ms: float = Field(..., description="Total submission time (ms)")


# ============= Request Schemas =============

class QuizStartRequest(BaseModel):
    """Request to start a new quiz session"""
    company: str = Field(..., description="Company name (e.g., TCS, Infosys)")
    level: DifficultyLevel = Field(..., description="Difficulty level")
    count: int = Field(10, ge=1, le=50, description="Number of questions")
    topic: str = Field("Aptitude", description="Quiz topic/category")
    
    class Config:
        json_schema_extra = {
            "example": {
                "company": "TCS",
                "level": "easy",
                "count": 10,
                "topic": "Aptitude"
            }
        }


class QuizAnswerSubmit(BaseModel):
    """Submit answer for a question in active session"""
    session_id: int
    question_id: int
    selected_answer: str


class QuizCompleteRequest(BaseModel):
    """Complete and submit entire quiz session"""
    session_id: int
    answers: List[QuizAnswerSubmit]


# ============= Response Schemas =============

class QuestionResponse(BaseModel):
    """Single question in quiz response"""
    id: int
    question_text: str
    options: List[str]
    
    class Config:
        from_attributes = True


class QuizStartResponse(BaseModel):
    """Response when quiz session is started"""
    session_id: int
    company: str
    level: str
    total_questions: int
    questions: List[QuestionResponse]
    started_at: datetime
    timing: Optional[TimingMetrics] = Field(None, description="Performance timing metrics")
    message: str = "Quiz started successfully"
    
    class Config:
        from_attributes = True


class AnswerDetail(BaseModel):
    """Detailed answer information after quiz completion"""
    question_id: int
    question_text: str
    options: List[str]
    selected_answer: Optional[str]
    correct_answer: str
    is_correct: bool
    explanation: Optional[str] = None


class QuizResultResponse(BaseModel):
    """Response after quiz completion"""
    session_id: int
    company: str
    level: str
    score: int
    total: int
    percentage: float
    status: str
    completed_at: datetime
    answers: List[AnswerDetail]
    timing: Optional[SubmitTimingMetrics] = Field(None, description="Performance timing metrics")
    message: str = "Quiz completed successfully"


# ============= Company Management Schemas =============

class CompanyCreate(BaseModel):
    """Create new company"""
    name: str
    description: Optional[str] = None


class CompanyResponse(BaseModel):
    """Company response"""
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuizLevelResponse(BaseModel):
    """Quiz level response"""
    id: int
    company_id: int
    level: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= Question Management =============

class QuestionCreate(BaseModel):
    """Create question manually"""
    company_id: int
    level: DifficultyLevel
    question_text: str
    options: List[str] = Field(..., min_length=4, max_length=4)
    correct_answer: str
    explanation: Optional[str] = None
    source: str = "manual"


class QuestionResponse(BaseModel):
    """Question response with full details"""
    id: int
    company_id: int
    level_id: int
    question_text: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str]
    source: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= Session History =============

class QuizSessionHistory(BaseModel):
    """Quiz session history for user"""
    id: int
    company: str
    level: str
    score: Optional[int]
    total_questions: int
    percentage: Optional[float]
    status: str
    started_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True
