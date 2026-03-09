from fastapi import APIRouter, Depends
from app.core.dependencies import require_role
from app.models.user import User

router = APIRouter(
    prefix="/api/student",
    tags=["Student"]
)

@router.get("/dashboard")
def student_dashboard(
    user: User = Depends(require_role("student"))
):
    return {
        "message": f"Welcome Student {user.name}",
        "academic_details": user.academic_details
    }
