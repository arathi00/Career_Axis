from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import require_role
from app.models.user import User

router = APIRouter(
    prefix="/trainer",
    tags=["Trainer"]
)


@router.get("/dashboard")
def trainer_dashboard(
    user: User = Depends(require_role("trainer"))
):
    # ✅ user exists ONLY here
    if not user.is_approved:
        raise HTTPException(
            status_code=403,
            detail="Trainer account not approved"
        )

    return {
        "message": f"Welcome Trainer {user.name}",
        "trainer_details": user.trainer_details
    }
