from fastapi import APIRouter, Depends
from app.core.dependencies import role_required

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/student")
def student_dashboard(user=Depends(role_required("student"))):
    return {"message": "Welcome Student"}

@router.get("/trainer/dashboard")
def trainer_dashboard(user=Depends(role_required("trainer"))):
    return {"message": "Welcome Trainer"}

@router.get("/admin/dashboard")
def admin_dashboard(user=Depends(role_required("admin"))):
    return {"message": "Welcome Admin"}
