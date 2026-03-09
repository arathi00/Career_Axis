from fastapi import APIRouter, Depends
from app.core.dependencies import require_role

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/student")
def student_dashboard(user=Depends(require_role("student"))):
    return {"message": "Welcome Student"}


@router.get("/trainer")
def trainer_dashboard(user=Depends(require_role("trainer"))):
    return {"message": "Welcome Trainer"}


@router.get("/admin")
def admin_dashboard(user=Depends(require_role("admin"))):
    return {"message": "Welcome Admin"}