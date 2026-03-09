from pydantic import BaseModel

class QuizCreate(BaseModel):
    title: str
    domain: str
    difficulty: str
    time_limit: int
    description: str
    
class QuizResponse(BaseModel):
    id: str
    title: str
    domain: str
    difficulty: str
    time_limit: int
    description: str
    status: str
    
class QuestionCreate(BaseModel):
    quiz_id: str
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    
from pydantic import BaseModel

class GenerateRequest(BaseModel):
    domain: str
    difficulty: str
    count: int

