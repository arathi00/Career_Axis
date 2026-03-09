from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List

from app.database.session import get_db
from app.core.dependencies import require_role, get_current_user
from app.models.interview import Interview
from app.models.notification import Notification
from app.models.user import User

from app.schemas.interview import (
    InterviewCreate,
    InterviewResponse,
    AssignedStudentOut,
    PastInterviewOut,
    FeedbackCreate,
    StudentAvailableSlotOut,
    StudentBookSlotOut,
    StudentMyInterviewOut,
)

router = APIRouter(prefix="/interviews", tags=["Interviews"])


# =========================================================
# TRAINER – CREATE INTERVIEW SLOT
# =========================================================
@router.post("/trainer/create", response_model=InterviewResponse)
def create_interview_slot(
    data: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "trainer":
        raise HTTPException(status_code=403, detail="Only trainers allowed")

    interview = Interview(
        trainer_id=current_user.id,
        student_id=None,
        date=data.date,
        time=data.time,
        position=data.position,
        notes=data.notes,
        status="available",
        join_link=None,
        feedback=None,
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


# =========================================================
# STUDENT – GET AVAILABLE SLOTS
# =========================================================
@router.get(
    "/student/available",
    response_model=List[StudentAvailableSlotOut],
)
def get_available_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students allowed")

    interviews = (
        db.query(Interview)
        .filter(
            Interview.status == "available",
            Interview.student_id == None,
        )
        .order_by(Interview.date, Interview.time)
        .all()
    )

    return [
        {
            "id": i.id,
            "date": i.date,
            "time": i.time,
            "position": i.position,
            "trainer_name": i.trainer.name if i.trainer else "Trainer",
        }
        for i in interviews
    ]


# =========================================================
# STUDENT – BOOK INTERVIEW
# =========================================================
@router.post(
    "/student/book/{interview_id}",
    response_model=StudentBookSlotOut,
)
def book_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students allowed")

    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.status == "available",
            Interview.student_id == None,
        )
        .with_for_update()
        .first()
    )

    if not interview:
        raise HTTPException(status_code=400, detail="Slot already booked")

    interview.student_id = current_user.id
    interview.status = "scheduled"   # ✅ FIXED
    interview.join_link = f"https://meet.jit.si/career-axis-{uuid.uuid4()}"

    notification = Notification(
        user_id=interview.trainer_id,
        interview_id=interview.id,
        message=(
            f"Slot on {interview.date} at {interview.time} "
            f"was booked by {current_user.name or current_user.email}"
        ),
    )

    db.add(notification)
    db.commit()
    db.refresh(interview)

    return interview


# =========================================================
# TRAINER – VIEW MY INTERVIEWS
# =========================================================
@router.get("/trainer/my-interviews", response_model=List[InterviewResponse])
def get_trainer_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "trainer":
        raise HTTPException(status_code=403, detail="Only trainers allowed")

    return (
        db.query(Interview)
        .filter(Interview.trainer_id == current_user.id)
        .order_by(Interview.date, Interview.time)
        .all()
    )


# =========================================================
# TRAINER – MARK INTERVIEW AS COMPLETED
# =========================================================
@router.post("/trainer/complete/{interview_id}")
def complete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "trainer":
        raise HTTPException(status_code=403, detail="Only trainers allowed")

    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.trainer_id == current_user.id,
        )
        .first()
    )

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    interview.status = "completed"
    db.commit()

    return {"message": "Interview marked as completed"}


# =========================================================
# STUDENT – VIEW MY INTERVIEWS
# =========================================================
@router.get(
    "/student/my-interviews",
    response_model=List[StudentMyInterviewOut],
)
def get_student_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students allowed")

    interviews = (
        db.query(Interview)
        .filter(Interview.student_id == current_user.id)
        .order_by(Interview.date, Interview.time)
        .all()
    )

    return [
        {
            "id": i.id,
            "date": i.date,
            "time": i.time,
            "position": i.position,
            "status": i.status,
            "trainer_name": i.trainer.name if i.trainer else "Trainer",
            "join_link": i.join_link,
        }
        for i in interviews
    ]


# =========================================================
# TRAINER – GET PAST INTERVIEWS
# =========================================================
@router.get(
    "/trainer/past-interviews",
    response_model=List[PastInterviewOut],
    dependencies=[Depends(require_role("trainer"))],
)
def get_past_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interviews = (
        db.query(Interview)
        .filter(
            Interview.trainer_id == current_user.id,
            Interview.status == "completed",
        )
        .order_by(Interview.date.desc(), Interview.time.desc())
        .all()
    )

    return [
        {
            "id": i.id,
            "student_name": i.student.name if i.student else "Unknown",  # ✅ FIXED
            "date": i.date,
            "position": i.position,
            "score": i.feedback_score,
            "feedback": i.feedback,
        }
        for i in interviews
    ]


# =========================================================
# TRAINER – GET ASSIGNED STUDENTS
# =========================================================
@router.get(
    "/trainer/assigned-students",
    response_model=List[AssignedStudentOut],
)
def get_assigned_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "trainer":
        raise HTTPException(status_code=403, detail="Only trainers allowed")

    interviews = (
        db.query(Interview)
        .filter(
            Interview.trainer_id == current_user.id,
            Interview.student_id != None,
        )
        .all()
    )

    seen = set()
    result = []

    for interview in interviews:
        student = interview.student
        if student and student.id not in seen:
            seen.add(student.id)
            result.append(
                {
                    "student_id": student.id,
                    "name": student.name,
                    "email": student.email,
                    "next_interview": f"{interview.date} {interview.time}",
                }
            )

    return result


# =========================================================
# TRAINER – SUBMIT FEEDBACK
# =========================================================
@router.post("/trainer/feedback/{interview_id}")
def submit_feedback(
    interview_id: int,
    data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "trainer":
        raise HTTPException(status_code=403, detail="Only trainers allowed")

    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.trainer_id == current_user.id,
        )
        .first()
    )

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if interview.status != "completed":
        raise HTTPException(
            status_code=400,
            detail="Interview must be completed before giving feedback",
        )

    if interview.feedback is not None:
        raise HTTPException(
            status_code=400,
            detail="Feedback already submitted",
        )

    interview.feedback = data.feedback
    interview.feedback_score = data.score
    db.commit()

    return {"message": "Feedback submitted successfully"}
