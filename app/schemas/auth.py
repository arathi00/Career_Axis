from pydantic import BaseModel, EmailStr, Field, ConfigDict, model_validator
from typing import List, Optional


class RegisterRequest(BaseModel):
    # common
    name: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    role: str = Field(...)

    # student fields (optional; required only when role == "student")
    university: Optional[str] = Field(None)
    college: Optional[str] = Field(None)
    course: Optional[str] = Field(None)
    branch: Optional[str] = Field(None)
    current_year: Optional[str] = Field(None, alias="currentYear")
    graduation_year: Optional[int] = Field(None, alias="graduationYear")
    cgpa: Optional[float] = Field(None)
    skills: Optional[List[str]] = Field(None)

    # trainer fields (optional; required only when role == "trainer")
    qualification: Optional[str] = Field(None)
    designation: Optional[str] = Field(None)
    expertise: Optional[str] = Field(None)
    experience: Optional[str] = Field(None)
    organization: Optional[str] = Field(None)

    model_config = ConfigDict(populate_by_name=True)

    @model_validator(mode="before")
    def empty_strings_to_none(cls, values):
        # Convert any empty-string fields to None so optional fields validate
        for k, v in list(values.items()):
            if isinstance(v, str) and v.strip() == "":
                values[k] = None
        return values


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    role: str
