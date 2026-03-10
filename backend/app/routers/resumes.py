from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from pydantic import BaseModel
import io

from app.dependencies.auth import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.resume import Resume
from app.services.ai_resume_builder import build_personalized_resume, AIResumeBuilder

router = APIRouter(tags=["Resume Builder"])

# GET endpoints for retrieving data
@router.get("/primary-details")
async def get_primary_details(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get student registration details (profile + resume data)
    """
    try:
        # Get student profile
        profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == current_user.id
        ).first()
        
        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Student profile not found. Please complete registration first."
            )
        
        # Get resume data
        resume = db.query(Resume).filter(
            Resume.user_id == current_user.id
        ).first()
        
        return {
            "user": {
                "id": current_user.id,
                "name": current_user.name,
                "email": current_user.email,
            },
            "profile": {
                "university": profile.university,
                "college": profile.college,
                "course": profile.course,
                "branch": profile.branch,
                "current_year": profile.current_year,
                "graduation_year": profile.graduation_year,
                "cgpa": profile.cgpa,
                "skills": profile.skills,
            },
            "resume": {
                "id": resume.id if resume else None,
                "phone": resume.phone if resume else None,
                "technical_skills": resume.technical_skills if resume else [],
                "key_strength": resume.key_strength if resume else "",
                "tools": resume.tools if resume else [],
                "internships": resume.internships if resume else [],
                "certifications": resume.certifications if resume else [],
                "achievements": resume.achievements if resume else [],
                "languages": resume.languages if resume else [],
            } if resume else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch student details: {str(e)}"
        )

@router.get("/")
async def get_all_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all resumes for the current user
    """
    try:
        resumes = db.query(Resume).filter(
            Resume.user_id == current_user.id
        ).all()
        
        return {
            "success": True,
            "resumes": [
                {
                    "id": r.id,
                    "phone": r.phone,
                    "technical_skills": r.technical_skills,
                    "key_strength": r.key_strength,
                    "tools": r.tools,
                    "internships": r.internships,
                    "certifications": r.certifications,
                    "achievements": r.achievements,
                    "languages": r.languages,
                }
                for r in resumes
            ]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch resumes: {str(e)}"
        )

class BuildResumeRequest(BaseModel):
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    student_data: Optional[Dict[str, Any]] = None

class SaveResumeRequest(BaseModel):
    phone: Optional[str] = None
    technical_skills: Optional[list] = []
    key_strength: Optional[str] = None
    tools: Optional[list] = []
    internships: Optional[list] = []
    certifications: Optional[list] = []
    achievements: Optional[list] = []
    languages: Optional[list] = []

class ResumeBuildResponse(BaseModel):
    success: bool
    resume: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@router.post("/")
async def save_resume(
    resume_data: SaveResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save or update resume data for the current user
    """
    try:
        # Get or create resume
        resume = db.query(Resume).filter(
            Resume.user_id == current_user.id
        ).first()
        
        if not resume:
            # Create new resume
            resume = Resume(
                user_id=current_user.id,
                phone=resume_data.phone,
                technical_skills=resume_data.technical_skills,
                key_strength=resume_data.key_strength,
                tools=resume_data.tools,
                internships=resume_data.internships,
                certifications=resume_data.certifications,
                achievements=resume_data.achievements,
                languages=resume_data.languages,
            )
            db.add(resume)
        else:
            # Update existing resume
            resume.phone = resume_data.phone
            resume.technical_skills = resume_data.technical_skills
            resume.key_strength = resume_data.key_strength
            resume.tools = resume_data.tools
            resume.internships = resume_data.internships
            resume.certifications = resume_data.certifications
            resume.achievements = resume_data.achievements
            resume.languages = resume_data.languages
        
        db.commit()
        db.refresh(resume)
        
        return {
            "success": True,
            "message": "Resume saved successfully",
            "resume": {
                "id": resume.id,
                "phone": resume.phone,
                "technical_skills": resume.technical_skills,
                "key_strength": resume.key_strength,
                "tools": resume.tools,
                "internships": resume.internships,
                "certifications": resume.certifications,
                "achievements": resume.achievements,
                "languages": resume.languages,
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save resume: {str(e)}"
        )


@router.post("/build", response_model=ResumeBuildResponse)
async def build_resume(
    request: BuildResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Build a personalized resume based on student data and job requirements
    """
    try:
        # Validate input
        if not request.job_title and not request.job_description:
            raise HTTPException(
                status_code=400,
                detail="Please provide either Job Title or Job Description"
            )
        
        # Fetch student data if not provided
        student_data = request.student_data
        if not student_data:
            # Get profile from database
            profile = db.query(StudentProfile).filter(
                StudentProfile.user_id == current_user.id
            ).first()
            
            resume = db.query(Resume).filter(
                Resume.user_id == current_user.id
            ).first()
            
            # Build student data from database
            student_data = {
                "name": current_user.name,
                "email": current_user.email,
                "phone": resume.phone if resume else None,
                "summary": resume.key_strength if resume else "",
                "technical_skills": resume.technical_skills if resume else [],
                "internships": resume.internships if resume else [],
                "certifications": resume.certifications if resume else [],
                "achievements": resume.achievements if resume else [],
                "languages": resume.languages if resume else [],
                "tools": resume.tools if resume else [],
                "university": profile.university if profile else None,
                "course": profile.course if profile else None,
                "branch": profile.branch if profile else None,
                "cgpa": profile.cgpa if profile else None,
            }
        
        # Build resume using AI
        personalized_resume = build_personalized_resume(
            student_data=student_data,
            job_title=request.job_title,
            jd_content=request.job_description
        )
        
        return ResumeBuildResponse(
            success=True,
            resume=personalized_resume
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume building failed: {str(e)}"
        )

@router.post("/upload-jd")
async def upload_job_description(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload and parse job description file (PDF, DOCX, TXT)
    """
    try:
        # Read file content
        content = await file.read()
        
        # For now, assume text file
        # In production, you'd use libraries like PyPDF2, python-docx
        jd_text = content.decode('utf-8')
        
        # Parse JD using AI
        parsed_jd = AIResumeBuilder.parse_jd_file(jd_text, file.content_type)
        
        return {
            "success": True,
            "parsed_data": parsed_jd
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse JD: {str(e)}"
        )

@router.post("/analyze-match")
async def analyze_job_match(
    request: BuildResumeRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Analyze how well the student matches the job
    """
    try:
        # Parse JD if provided as text
        job_data = {}
        if request.job_description:
            job_data = AIResumeBuilder.parse_jd_file(request.job_description, "text")
        else:
            job_data = {"job_title": request.job_title, "required_skills": []}
        
        # Analyze match
        analysis = AIResumeBuilder.analyze_student_profile(
            request.student_data or {},
            job_data
        )
        
        return {
            "success": True,
            "analysis": analysis
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@router.post("/generate-summary")
async def generate_professional_summary(
    request: BuildResumeRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate a unique professional summary based on job title and student skills
    This endpoint generates multiple unique variations
    """
    try:
        job_title = request.job_title or "Professional"
        skills = request.student_data.get('technical_skills', []) if request.student_data else []
        achievements = request.student_data.get('achievements', []) if request.student_data else []
        
        # Generate unique summaries with different styles
        import random
        
        summary_templates = [
            # Template 1: Achievement-focused
            f"Results-driven {job_title} with expertise in {', '.join(skills[:2]) if skills else 'cutting-edge technologies'}. Proven track record of delivering high-impact solutions and driving innovation. Passionate about continuous learning and technical excellence.",
            
            # Template 2: Skills-focused
            f"Skilled {job_title} proficient in {', '.join(skills[:3]) if len(skills) >= 3 else ', '.join(skills) if skills else 'modern development practices'}. Strong problem-solving abilities and collaborative mindset. Committed to building scalable and maintainable solutions.",
            
            # Template 3: Impact-focused
            f"Innovative {job_title} dedicated to creating impactful digital solutions. Experienced with {skills[0] if skills else 'full-stack technologies'} and emerging technologies. Focused on writing clean code and mentoring team members.",
            
            # Template 4: Growth-focused
            f"Enthusiastic {job_title} with expertise in {', '.join(skills[:2]) if skills else 'software development'}. Quick learner with strong analytical skills and passion for solving complex problems. Eager to contribute to challenging projects and grow professionally.",
            
            # Template 5: Professional-focused
            f"Professional {job_title} with demonstrated competency in {', '.join(skills[:3]) if len(skills) >= 3 else ', '.join(skills) if skills else 'software engineering'}. Dedicated to delivering quality code and maintaining best practices. Strong communicator with excellent problem-solving skills.",
        ]
        
        # Select a random template for variety
        selected_summary = random.choice(summary_templates)
        
        return {
            "success": True,
            "professional_summary": selected_summary,
            "message": f"Generated unique professional summary for {job_title}"
        }
        
    except Exception as e:
        print(f"Error generating summary: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate summary: {str(e)}"
        )