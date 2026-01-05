from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas.auth import RegisterSchema, LoginSchema
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.database.session import get_db
from app.core.security import hash_password, verify_password
from app.core.config import create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

# =========================
# REGISTER
# =========================
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    # 1️⃣ Check if email already exists
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists"
        )

    try:
        # 2️⃣ Convert graduation_year and cgpa to correct types
        graduation_year = int(data.graduation_year)
        cgpa = float(data.cgpa)
        skills: List[str] = data.skills or []

        # 3️⃣ Create user
        new_user = User(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
            role="student"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # 4️⃣ Create student profile
        profile = StudentProfile(
            user_id=new_user.id,
            university=data.university,
            college=data.college,
            course=data.course,
            branch=data.branch,
            current_year=data.current_year,
            graduation_year=graduation_year,
            cgpa=cgpa,
            skills=skills
        )
        db.add(profile)
        db.commit()

    except Exception as e:
        db.rollback()
        # Show backend error for debugging (mask in production)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {e}"
        )

    return {
        "message": "Registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_token(
        data={"user_id": user.id, "role": user.role}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }
