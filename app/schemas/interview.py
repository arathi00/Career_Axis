from pydantic import BaseModel, Field
from datetime import date, time
from typing import Optional, List


# =========================
# USER SUMMARY
# =========================
class UserSummary(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


# =========================
# INTERVIEW CREATE
# =========================
class InterviewCreate(BaseModel):
    date: date
    time: time
    position: str
    notes: Optional[str] = None


# =========================
# STUDENT OUTPUT
# =========================
class StudentOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


# =========================
# INTERVIEW RESPONSE (GENERIC)
# =========================
class InterviewResponse(BaseModel):
    id: int
    trainer_id: int
    student_id: Optional[int] = None
    date: date
    time: time
    position: str
    notes: Optional[str] = None
    status: Optional[str] = None
    trainer: Optional[UserSummary] = None
    student: Optional[StudentOut] = None
    join_link: Optional[str] = None

    class Config:
        from_attributes = True


# =========================
# TRAINER VIEW – STUDENT INFO
# =========================
class StudentInfo(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


# =========================
# TRAINER INTERVIEW VIEW
# =========================
class TrainerInterviewOut(BaseModel):
    id: int
    date: date
    time: time
    position: str
    status: str
    join_link: Optional[str] = None
    student: Optional[StudentInfo] = None

    class Config:
        from_attributes = True


# =========================
# FEEDBACK
# =========================
class FeedbackCreate(BaseModel):
    score: int = Field(..., ge=0, le=100)
    feedback: Optional[str] = None


# =========================
# ASSIGNED STUDENT
# =========================
class AssignedStudentOut(BaseModel):
    student_id: int
    name: str
    email: str
    next_interview: str


# =========================
# PAST INTERVIEW
# =========================
class PastInterviewOut(BaseModel):
    id: int
    student_name: str
    date: date
    position: str
    score: Optional[int] = None
    feedback: Optional[str] = None

    class Config:
        from_attributes = True


# =====================================================
# ✅ STUDENT MOCK INTERVIEW – FINAL RESPONSE SCHEMAS
# =====================================================

# ---------- Available Slots (Before Booking) ----------
class StudentAvailableSlotOut(BaseModel):
    id: int
    date: date
    time: time
    position: str
    trainer_name: str

    class Config:
        from_attributes = True


# ---------- Booking Response ----------
class StudentBookSlotOut(BaseModel):
    id: int
    date: date
    time: time
    position: str
    status: str
    join_link: Optional[str] = None

    class Config:
        from_attributes = True


# ---------- My Booked Interviews ----------
class StudentMyInterviewOut(BaseModel):
    id: int
    date: date
    time: time
    position: str
    status: str
    trainer_name: str
    join_link: Optional[str] = None

    class Config:
        from_attributes = True
