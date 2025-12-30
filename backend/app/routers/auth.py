from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.auth import RegisterSchema, LoginSchema
from app.models.user import User
from app.database.session import get_db
from app.core.security import hash_password, verify_password
from app.core.config import create_token
from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="student"
    )

    db.add(new_user)
    db.commit()
    return {"message": "Registered successfully"}

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"user_id": user.id, "role": user.role})
    return {"access_token": token}
