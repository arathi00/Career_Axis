from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, LoginResponse
from app.utils.hashing import hash_password, verify_password
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    academic = None
    trainer = None

    if data.role == "student":
        academic = {
            "university": data.university,
            "college": data.college,
            "course": data.course,
            "branch": data.branch,
            "cgpa": data.cgpa,
            "skills": data.skills,
        }

    if data.role == "trainer":
        trainer = {
            "qualification": data.qualification,
            "designation": data.designation,
            "expertise": data.expertise,
            "experience": data.experience,
            "organization": data.organization,
        }

    # ✅ approval logic (INSIDE function)
    is_approved = True
    if data.role == "trainer":
        is_approved = False
    
    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role,
        academic_details=academic,
        trainer_details=trainer,
        is_approved=is_approved
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Registration successful"}


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    # ✅ block unapproved trainers BEFORE token creation
    if user.role == "trainer" and not user.is_approved:
        raise HTTPException(
            status_code=403,
            detail="Trainer account pending admin approval"
        )

    token = create_access_token(
        {"user_id": user.id, "role": user.role}
    )

    return {
        "access_token": token,
        "role": user.role
    }
