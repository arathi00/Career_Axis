from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional


class RegisterRequest(BaseModel):
    # common
    name: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    role: str = Field(...)

    # student fields (optional; validated in router based on `role`)
    university: Optional[str] = Field(None)
    college: Optional[str] = Field(None)
    course: Optional[str] = Field(None)
    branch: Optional[str] = Field(None)
    current_year: Optional[str] = Field(None, alias="currentYear")
    graduation_year: Optional[int] = Field(None, alias="graduationYear")
    cgpa: Optional[float] = Field(None)
    skills: Optional[List[str]] = Field(None)

    # trainer fields (optional; validated in router based on `role`)
    qualification: Optional[str] = Field(None)
    designation: Optional[str] = Field(None)
    expertise: Optional[str] = Field(None)
    experience: Optional[str] = Field(None)
    organization: Optional[str] = Field(None)

    class Config:
        populate_by_name = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    role: str
