from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import SessionLocal
from app.models.user import User

# ----------------------------
# OAuth2 Scheme (CORS SAFE)
# ----------------------------
oauth2_scheme = HTTPBearer(auto_error=False)

# ----------------------------
# Database Dependency
# ----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------------------
# Get Current User (JWT)
# ----------------------------
def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    # 🔥 Allow OPTIONS request (CORS preflight)
    if request.method == "OPTIONS":
        return None

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    token = credentials.credentials

    print("Token received:", token)  # Debugging token

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        print("Decoded payload:", payload)  # Debugging payload

        user_id: int | None = payload.get("user_id")
        if user_id is None:
            print("Invalid token: Missing user_id")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

    except JWTError as e:
        print("JWTError:", str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        print("User not found for user_id:", user_id)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


# ----------------------------
# Role-based Access Control
# ----------------------------
def require_role(role: str):
    """
    Usage:
        Depends(require_role("trainer"))
        Depends(require_role("student"))
        Depends(require_role("admin"))
    """
    def _require_role(
        current_user: User = Depends(get_current_user)
    ):
        if current_user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user

    return _require_role