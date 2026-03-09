from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc

from app.database.session import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.quiz_result import QuizResult
from app.models.interview import Interview
from app.core.dependencies import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])


# ==========================================================
# GET ALL STUDENTS (Pagination + Sorting)
# ==========================================================

@router.get("/students", operation_id="get_all_students")
def get_students(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    sort_by: str = "id",
    order: str = "asc",
    db: Session = Depends(get_db),
    # Temporarily disabling admin role requirement for testing
    # admin=Depends(require_role("admin"))
):
    offset = (page - 1) * limit

    # Safe sorting fields
    allowed_sort_fields = {
        "id": User.id,
        "name": User.name
    }

    sort_column = allowed_sort_fields.get(sort_by, User.id)

    if order == "desc":
        sort_column = desc(sort_column)
    else:
        sort_column = asc(sort_column)

    students = (
        db.query(User)
        .filter(User.role == "student")
        .order_by(sort_column)
        .offset(offset)
        .limit(limit)
        .all()
    )

    result = []

    for student in students:
        
        interview_count = db.query(func.count(Interview.id)).filter(
            Interview.student_id == student.id
        ).scalar()

        result.append({
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "cgpa": student.academic_details.get("cgpa") if student.academic_details else None,
            "interviews": interview_count or 0,
            "status": "Active"
        })

    total_students = db.query(func.count(User.id)).filter(
        User.role == "student"
    ).scalar()

    return {
        "page": page,
        "limit": limit,
        "total": total_students,
        "data": result
    }


# ==========================================================
# GET STUDENT DETAILS
# ==========================================================

@router.get("/students/{student_id}", operation_id="get_student_details_by_id")
def get_student_details(
    student_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")


    interview_count = db.query(func.count(Interview.id)).filter(
        Interview.student_id == student.id
    ).scalar()

    return {
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "cgpa": student.academic_details.get("cgpa") if student.academic_details else None,
        "interviews": interview_count or 0,
        "status": "Active"
    }


# ==========================================================
# DISABLE STUDENT
# ==========================================================

@router.put("/students/{student_id}/disable", operation_id="disable_student_by_id")
def disable_student(
    student_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.is_active = False
    db.commit()

    return {"message": "Student disabled successfully"}


# ==========================================================
# DELETE STUDENT
# ==========================================================

@router.delete("/students/{student_id}", operation_id="delete_student_by_id")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()

    return {"message": "Student deleted successfully"}


# ==========================================================
# GET PENDING TRAINERS
# ==========================================================

@router.get("/trainers/pending")
def get_pending_trainers(
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    trainers = db.query(User).filter(
        User.role == "trainer",
        User.is_approved == False
    ).all()

    result = []

    for trainer in trainers:
        result.append({
            "id": trainer.id,
            "name": trainer.name,
            "email": trainer.email,
            "qualification": trainer.trainer_details.get("qualification") if trainer.trainer_details else None,
            "designation": trainer.trainer_details.get("designation") if trainer.trainer_details else None,
            "expertise": trainer.trainer_details.get("expertise") if trainer.trainer_details else None,
            "status": "Pending"
        })

    return result

# ==========================================================
# APPROVE TRAINER
# ==========================================================

@router.get("/trainers/approved", operation_id="get_approved_trainers")
def get_approved_trainers(
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    trainers = db.query(User).filter(
        User.role == "trainer",
        User.is_approved == True
    ).all()

    result = []

    for trainer in trainers:
        result.append({
            "id": trainer.id,
            "name": trainer.name,
            "email": trainer.email,
            "qualification": trainer.trainer_details.get("qualification") if trainer.trainer_details else None,
            "designation": trainer.trainer_details.get("designation") if trainer.trainer_details else None,
            "expertise": trainer.trainer_details.get("expertise") if trainer.trainer_details else None,
            "status": "Approved"
        })

    return result

# ==========================================================
# REJECT TRAINER
# ==========================================================

@router.put("/trainers/{trainer_id}/reject", operation_id="reject_trainer_by_id")
def reject_trainer(
    trainer_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    trainer = db.query(User).filter(User.id == trainer_id).first()

    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")

    db.delete(trainer)
    db.commit()

    return {"message": "Trainer rejected successfully"}


# ==========================================================
# DISABLE TRAINER
# ==========================================================

@router.put("/trainers/{trainer_id}/disable", operation_id="disable_trainer_by_id")
def disable_trainer(
    trainer_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    trainer = db.query(User).filter(User.id == trainer_id).first()

    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")

    trainer.is_disabled = True
    db.commit()

    return {"message": "Trainer disabled successfully"}


# ==========================================================
# ADMIN DASHBOARD
# ==========================================================

@router.get("/dashboard", operation_id="get_admin_dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):

    total_students = db.query(func.count(User.id)).filter(
        User.role == "student"
    ).scalar()

    active_students = db.query(func.count(User.id)).filter(
        User.role == "student"
    ).scalar()

    total_trainers = db.query(func.count(User.id)).filter(
        User.role == "trainer"
    ).scalar()

    approved_trainers = db.query(func.count(User.id)).filter(
        User.role == "trainer",
        User.is_approved == True
    ).scalar()

    pending_trainers = db.query(func.count(User.id)).filter(
        User.role == "trainer",
        User.is_approved == False
    ).scalar()

    return {
        "students": {
            "total": total_students,
            "active": active_students
        },
        "trainers": {
            "total": total_trainers,
            "approved": approved_trainers,
            "pending": pending_trainers
        }
    }