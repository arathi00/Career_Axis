from pydantic import BaseModel, Field
from typing import List

# detect pydantic v2 at import time
try:
    from pydantic import ConfigDict  # type: ignore
    _PYDANTIC_V2 = True
except Exception:
    _PYDANTIC_V2 = False


class RegisterSchema(BaseModel):
    # Use Field aliases for incoming camelCase JSON. No special config required.

    name: str
    email: str
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
    email: str
    password: str
