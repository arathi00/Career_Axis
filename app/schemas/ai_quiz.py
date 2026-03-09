from pydantic import BaseModel


class GenerateQuizRequest(BaseModel):
    domain: str
    difficulty: str
    count: int