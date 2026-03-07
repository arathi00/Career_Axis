from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate
from app.dependencies.auth import get_current_user
from app.models.student_profile import StudentProfile

router = APIRouter(tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Return the authenticated user's core registration + profile data."""
    profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "university": profile.university if profile else None,
        "college": profile.college if profile else None,
        "course": profile.course if profile else None,
        "branch": profile.branch if profile else None,
        "current_year": profile.current_year if profile else None,
        "graduation_year": profile.graduation_year if profile else None,
        "cgpa": profile.cgpa if profile else None,
        "skills": profile.skills if profile else []
    }
