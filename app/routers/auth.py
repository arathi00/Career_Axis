from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.auth import RegisterRequest, LoginRequest
from app.models.user import User
from app.database.session import get_db
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if user:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Create user with 'password' field (not password_hash)
    new_user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),  # Changed from password_hash to password
        role=data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Registered successfully", "user_id": new_user.id}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    # Use 'user.password' not 'user.password_hash'
    if not user or not verify_password(data.password, user.password):  # Changed from password_hash to password
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {"access_token": token, "role": user.role}