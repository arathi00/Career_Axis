from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class InternshipSchema(BaseModel):
    company: str
    role: str
    duration: str
    description: Optional[str] = None

class ResumeCreate(BaseModel):
    # Career Objective
    job_role: Optional[str] = None
    key_strength: Optional[str] = None
    domain: Optional[str] = None
    
    # Skills
    technical_skills: Optional[List[str]] = None
    tools: Optional[List[str]] = None
    
    # Internship / Training
    internships: Optional[List[Dict[str, Any]]] = None
    
    # Other sections
    certifications: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    
    # Contact info
    phone: Optional[str] = None
    address: Optional[str] = None
    
    # Generated PDF location      
    file_path: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "job_role": "Software Engineer",
                "key_strength": "Passionate developer with 3+ years experience",
                "technical_skills": ["Python", "FastAPI", "PostgreSQL"],
                "tools": ["Git", "Docker", "AWS"],
                "internships": [
                    {
                        "company": "Tech Corp",
                        "role": "Backend Intern",
                        "duration": "3 months",
                        "description": "Developed REST APIs"
                    }
                ],
                "phone": "+1234567890"
            }
        }