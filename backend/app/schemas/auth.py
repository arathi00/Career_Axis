from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List

class RegisterSchema(BaseModel):
    model_config = ConfigDict(validate_by_name=True)

    name: str
    email: EmailStr
    password: str

    university: str
    college: str
    course: str
    branch: str

    current_year: str = Field(alias="currentYear")
    graduation_year: int = Field(alias="graduationYear")
    cgpa: float
    skills: List[str]


class LoginSchema(BaseModel):
    email: EmailStr
    password: str
