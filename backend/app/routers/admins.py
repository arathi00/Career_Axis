from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import require_role, get_db
from app.models.user import User

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


@router.get("/pending-trainers")
def get_pending_trainers(
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):
    return db.query(User).filter(
        User.role == "trainer",
        User.is_approved == False
    ).all()


@router.post("/approve-trainer/{trainer_id}")
def approve_trainer(
    trainer_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):
    trainer = db.query(User).filter(
        User.id == trainer_id,
        User.role == "trainer"
    ).first()

    if not trainer:
        return {"error": "Trainer not found"}

    trainer.is_approved = True
    db.commit()

    return {"message": "Trainer approved successfully"}

@router.get("/dashboard")
def admin_dashboard(
    user: User = Depends(require_role("admin"))
):
    return {
        "message": f"Welcome Admin {user.name}"
    }
