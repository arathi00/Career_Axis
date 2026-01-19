from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database.session import get_db
from app.models.resume import Resume
from app.models.student_profile import StudentProfile
from app.dependencies.auth import get_current_user
from app.schemas.resume import ResumeCreate  # NEW IMPORT

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

@router.get("/primary-details")
def get_primary_details(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    return {
        "name": current_user.name,
        "email": current_user.email,
        "university": profile.university if profile else None,
        "college": profile.college if profile else None,
        "course": profile.course if profile else None,
        "branch": profile.branch if profile else None,
        "cgpa": profile.cgpa if profile else None,
        "summary": resume.key_strength if resume and resume.key_strength else "",
        "skills": resume.technical_skills if resume and resume.technical_skills else [],
        "phone": resume.phone if resume else None,
        "address": resume.address if resume else None,
    }

@router.post("/")
def create_or_update_resume(
    resume_data: ResumeCreate,  # CHANGED from data: dict
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Convert to dict, removing None values
    data = {k: v for k, v in resume_data.dict().items() if v is not None}
    
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    try:
        if resume:
            # Update only provided fields
            for key, value in data.items():
                setattr(resume, key, value)
            db.commit()
            return {"message": "Resume updated successfully", "resume_id": resume.id}
        else:
            # Create new with all data
            resume = Resume(user_id=current_user.id, **data)
            db.add(resume)
            db.commit()
            db.refresh(resume)
            return {"message": "Resume created successfully", "resume_id": resume.id}
            
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to save resume: {str(e)}"
        )

@router.get("/")
def get_resume(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        return {}

    # Convert None arrays to empty lists
    def ensure_list(value):
        return value if value is not None else []
    
    return {
        "job_role": resume.job_role,
        "summary": resume.key_strength,
        "domain": resume.domain,
        "technical_skills": ensure_list(resume.technical_skills),
        "tools": ensure_list(resume.tools),
        "internships": resume.internships or [],
        "certifications": ensure_list(resume.certifications),
        "achievements": ensure_list(resume.achievements),
        "languages": ensure_list(resume.languages),
        "phone": resume.phone,
        "address": resume.address,
        "file_path": resume.file_path
    }