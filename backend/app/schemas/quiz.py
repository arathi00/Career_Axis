from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class CompanySchema(BaseModel):
    """Company with available tracks (for Swagger clarity)"""
    company_id: Optional[int] = None
    company_name: str
    track: Optional[str] = None  # Backward compatibility for existing clients
    tracks: List[str]

    class Config:
        from_attributes = True


class ExamTypeResponse(BaseModel):
    """Exam types offered by a company"""
    company_name: str
    exam_types: List[str]

    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    """Categories available for a company (optionally filtered by exam type)"""
    company_name: str
    exam_type: Optional[str] = None
    categories: List[str]

    class Config:
        from_attributes = True


class TopicItem(BaseModel):
    """Topic with available question count"""
    topic: str
    question_count: int


class TopicResponse(BaseModel):
    """Topics for a company/category/exam_type/track with counts"""
    company_name: str
    track: str
    exam_type: str
    category: str
    topics: List[TopicItem]

    class Config:
        from_attributes = True


class QuestionBankStatsResponse(BaseModel):
    """High-level question bank statistics"""
    total_questions: int
    active_questions: int
    inactive_questions: int

    class Config:
        from_attributes = True


class AIQuestionRequest(BaseModel):
    """Request to generate AI questions"""
    company: str
    track: str
    exam_type: str
    category: str
    topic: str
    difficulty: str
    num_questions: int
    question_type: str = "MCQ"


class QuestionView(BaseModel):
    """Question without correct answer (for quiz play)"""
    question_id: int
    question: str
    options: List[str]

    class Config:
        from_attributes = True


class QuestionWithAnswer(BaseModel):
    """Question with correct answer (for evaluation)"""
    question_id: int
    question: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str]

    class Config:
        from_attributes = True


class QuizCreateResponse(BaseModel):
    """Response after generating quiz"""
    quiz_id: int
    message: str
    num_questions: int


class QuizFetchResponse(BaseModel):
    """Response when fetching quiz to take (no answers)"""
    quiz_id: int
    company: str
    track: str
    topic: str
    difficulty: str
    question_count: int
    questions: List[QuestionView]


class CompanyInfo(BaseModel):
    """Company information"""
    company_name: str
    track: str


class CategoryInfo(BaseModel):
    """Category information with limits"""
    category: str
    total_questions: int
    exam_type: str


class TopicInfo(BaseModel):
    """Topic information with available question count"""
    topic: str
    count: int


class QuestionBankStats(BaseModel):
    """Question bank statistics"""
    total_companies: int
    total_configured_questions: int
    total_questions_in_db: int
    overall_completion: float
    company_stats: List[dict]

class QuizAnswerItem(BaseModel):
    """Single answer submission"""
    question_id: int
    selected_answer: str
    time_spent: Optional[int] = None  # Time spent in seconds


class QuizSubmitRequest(BaseModel):
    """Submit quiz answers"""
    quiz_id: int
    started_at: Optional[datetime] = None
    answers: List[QuizAnswerItem]
    total_time_seconds: Optional[int] = None  # Total quiz time in seconds


class QuizResultResponse(BaseModel):
    """Quiz evaluation result"""
    quiz_id: int
    score: int
    total: int
    percentage: float
    started_at: datetime
    finished_at: datetime
    total_time_seconds: Optional[int] = None  # Total time taken in seconds
    questions: List[QuestionWithAnswer]  # Show correct answers after submission


class QuizResultView(BaseModel):
    """View quiz result history"""
    result_id: int
    quiz_id: int
    score: int
    total: int
    percentage: float
    started_at: datetime
    submitted_at: datetime
    finished_at: datetime

    class Config:
        from_attributes = True


class QuestionResult(BaseModel):
    """Individual question result with user's selection"""
    question_id: int
    question: str
    selected_option: Optional[str]
    correct_option: str
    is_correct: bool


class QuizResultDetailResponse(BaseModel):
    """Detailed quiz result with all question results"""
    quiz_id: int
    result_id: int
    user_id: Optional[int] = None
    score: int
    total_questions: int
    correct_answers: int
    wrong_answers: int
    percentage: float
    started_at: datetime
    submitted_at: datetime
    finished_at: datetime
    results: List[QuestionResult]

    class Config:
        from_attributes = True


class QuizListItem(BaseModel):
    """Single quiz item in list view"""
    quiz_id: int
    company: str
    track: str
    exam_type: str
    category: str
    topic: str
    difficulty: str
    total_questions: int
    created_at: datetime

    class Config:
        from_attributes = True


class QuizListResponse(BaseModel):
    """Paginated quiz list response"""
    total: int
    skip: int
    limit: int
    quizzes: List[QuizListItem]

    class Config:
        from_attributes = True


class BankQuizGenerateRequest(BaseModel):
    """Request to generate quiz from bank questions"""
    company: str
    exam_type: str
    difficulty: str
    num_questions: int = 10


class BankQuizQuestion(BaseModel):
    """Question from bank quiz"""
    id: int
    question: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str]


class BankQuizGenerateResponse(BaseModel):
    """Response for bank quiz generation"""
    questions: List[BankQuizQuestion]
    total: int
    company: str
    exam_type: str
    difficulty: str

    class Config:
        from_attributes = True
