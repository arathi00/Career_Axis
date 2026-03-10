import os
import json
from dotenv import load_dotenv
import re

# Try to import Google's generative AI library, but make it optional
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    genai = None

load_dotenv()

if GENAI_AVAILABLE:
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
    else:
        GENAI_AVAILABLE = False
        model = None
else:
    model = None


class AIResumeBuilder:
    """
    AI-powered resume builder that creates personalized,
    ATS-friendly resumes based on student data and job requirements
    """
    
    @staticmethod
    def parse_jd_file(file_content: str, file_type: str) -> dict:
        """
        Parse uploaded JD file to extract key information
        """
        prompt = f"""
        Analyze this job description and extract the following information in JSON format:
        
        JOB DESCRIPTION:
        {file_content}
        
        Extract:
        1. job_title: The exact job title
        2. required_skills: List of technical skills mentioned
        3. preferred_skills: List of nice-to-have skills
        4. responsibilities: Key responsibilities (list)
        5. qualifications: Required qualifications (list)
        6. experience_level: Years of experience needed
        7. key_requirements: Main requirements (list)
        8. company_culture: Any culture/values mentioned
        9. industry: Industry sector
        
        Return ONLY valid JSON in this exact format:
        {{
            "job_title": "",
            "required_skills": [],
            "preferred_skills": [],
            "responsibilities": [],
            "qualifications": [],
            "experience_level": "",
            "key_requirements": [],
            "company_culture": "",
            "industry": ""
        }}
        """
        
        # Check if AI service is available
        if not GENAI_AVAILABLE:
            return {
                "job_title": "",
                "required_skills": [],
                "preferred_skills": [],
                "responsibilities": [],
                "qualifications": [],
                "experience_level": "",
                "key_requirements": [],
                "company_culture": "",
                "industry": ""
            }
        
        try:
            response = model.generate_content(prompt)
            cleaned = response.text.strip().replace("```json", "").replace("```", "")
            return json.loads(cleaned)
        except Exception as e:
            print(f"Error parsing JD: {e}")
            return {
                "job_title": "",
                "required_skills": [],
                "preferred_skills": [],
                "responsibilities": [],
                "qualifications": [],
                "experience_level": "",
                "key_requirements": [],
                "company_culture": "",
                "industry": ""
            }
    
    @staticmethod
    def analyze_student_profile(student_data: dict, job_data: dict) -> dict:
        """
        Analyze student profile against job requirements
        """
        prompt = f"""
        Analyze this student's profile against the job requirements:
        
        JOB REQUIREMENTS:
        {json.dumps(job_data, indent=2)}
        
        STUDENT PROFILE:
        {json.dumps(student_data, indent=2)}
        
        Perform analysis and return:
        1. matched_skills: Skills from student that match job requirements
        2. missing_skills: Required skills student doesn't have
        3. skill_gap_analysis: Detailed analysis of gaps
        4. strength_areas: Areas where student excels
        5. improvement_suggestions: How to bridge gaps
        6. match_percentage: Overall match score (0-100)
        
        Return STRICT JSON format:
        {{
            "matched_skills": [],
            "missing_skills": [],
            "skill_gap_analysis": "",
            "strength_areas": [],
            "improvement_suggestions": [],
            "match_percentage": 0
        }}
        """
        
        # Check if AI service is available
        if not GENAI_AVAILABLE:
            return {
                "matched_skills": [],
                "missing_skills": [],
                "skill_gap_analysis": "AI service not configured",
                "strength_areas": [],
                "improvement_suggestions": [],
                "match_percentage": 50
            }
        
        try:
            response = model.generate_content(prompt)
            cleaned = response.text.strip().replace("```json", "").replace("```", "")
            return json.loads(cleaned)
        except Exception as e:
            print(f"Error analyzing profile: {e}")
            return {
                "matched_skills": [],
                "missing_skills": [],
                "skill_gap_analysis": "",
                "strength_areas": [],
                "improvement_suggestions": [],
                "match_percentage": 50
            }
    
    @staticmethod
    def generate_ats_optimized_summary(student_data: dict, job_data: dict, analysis: dict) -> str:
        """
        Generate ATS-optimized professional summary
        """
        prompt = f"""
        Create a powerful, ATS-optimized professional summary for this student:
        
        JOB TITLE: {job_data.get('job_title', '')}
        COMPANY CULTURE: {job_data.get('company_culture', '')}
        
        STUDENT INFO:
        - Current Summary: {student_data.get('summary', '')}
        - Key Skills: {', '.join(student_data.get('technical_skills', []))}
        - Years of Experience: {student_data.get('total_experience', 'Fresher')}
        - Top Achievements: {', '.join(student_data.get('achievements', [])[:3])}
        
        MATCHED SKILLS: {', '.join(analysis.get('matched_skills', []))}
        
        RULES:
        1. Length: 3-4 lines max
        2. Include key matched skills
        3. Quantify achievements where possible
        4. Use strong action verbs
        5. Include years of experience
        6. Match job title and industry keywords
        7. Make it compelling for interviewers
        
        Generate ONLY the summary paragraph, no explanations:
        """
        
        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error generating summary: {e}")
            return student_data.get('summary', '')
    
    @staticmethod
    def enhance_project_descriptions(projects: list, job_data: dict, matched_skills: list) -> list:
        """
        Enhance project descriptions with ATS optimization and impact focus
        """
        enhanced_projects = []
        
        for project in projects:
            if isinstance(project, str):
                project = {"name": "Project", "description": project}
            
            prompt = f"""
            Enhance this project description to be ATS-friendly and impactful:
            
            PROJECT:
            Name: {project.get('name', 'Project')}
            Description: {project.get('description', '')}
            Technologies: {', '.join(project.get('technologies', []))}
            
            JOB CONTEXT:
            Required Skills: {', '.join(job_data.get('required_skills', []))}
            
            KEYWORDS TO INCLUDE: {', '.join(matched_skills)}
            
            RULES:
            1. Start with strong action verbs
            2. Include numbers/metrics (%, $, time saved)
            3. Highlight technologies used
            4. Focus on impact and results
            5. Include relevant keywords
            6. Keep it concise but detailed
            7. Max 2-3 sentences
            
            Generate enhanced description ONLY:
            """
            
            try:
                response = model.generate_content(prompt)
                enhanced_projects.append({
                    "name": project.get('name', 'Project'),
                    "description": response.text.strip(),
                    "technologies": project.get('technologies', [])
                })
            except:
                enhanced_projects.append(project)
        
        return enhanced_projects
    
    @staticmethod
    def prioritize_skills_by_job(student_skills: list, job_skills: list) -> list:
        """
        Prioritize skills based on job requirements
        """
        # First list required skills in order
        prioritized = []
        
        # Add matched skills first
        matched = [s for s in student_skills if any(job_skill.lower() in s.lower() for job_skill in job_skills)]
        prioritized.extend(matched)
        
        # Add remaining skills
        remaining = [s for s in student_skills if s not in matched]
        prioritized.extend(remaining)
        
        return prioritized
    
    @staticmethod
    def generate_achievement_bullets(achievements: list, job_data: dict) -> list:
        """
        Convert achievements into powerful bullet points
        """
        enhanced_achievements = []
        
        for achievement in achievements:
            prompt = f"""
            Convert this achievement into a powerful, quantifiable bullet point:
            
            ACHIEVEMENT: {achievement}
            JOB ROLE: {job_data.get('job_title', '')}
            
            RULES:
            1. Start with strong action verb
            2. Add numbers/percentages if possible
            3. Highlight impact
            4. Keep it 1 line
            5. Include relevant keywords
            
            Generate ONLY the enhanced bullet point:
            """
            
            try:
                response = model.generate_content(prompt)
                enhanced_achievements.append(response.text.strip())
            except:
                enhanced_achievements.append(achievement)
        
        return enhanced_achievements
    
    @staticmethod
    def extract_keywords_from_jd(jd_text: str) -> list:
        """
        Extract important keywords from job description
        """
        prompt = f"""
        Extract the most important keywords from this job description:
        
        {jd_text}
        
        Return as JSON array of keywords (technical skills, soft skills, tools, methodologies):
        """
        
        try:
            response = model.generate_content(prompt)
            cleaned = response.text.strip().replace("```json", "").replace("```", "")
            return json.loads(cleaned)
        except:
            return []
    
    @staticmethod
    def calculate_ats_score(resume_data: dict, job_data: dict, keywords: list) -> dict:
        """
        Calculate ATS compatibility score with detailed breakdown
        """
        prompt = f"""
        Calculate ATS score for this resume against the job:
        
        RESUME DATA:
        {json.dumps(resume_data, indent=2)}
        
        JOB DATA:
        {json.dumps(job_data, indent=2)}
        
        KEYWORDS FROM JD:
        {json.dumps(keywords, indent=2)}
        
        Return score breakdown in JSON:
        {{
            "total_score": 0-100,
            "breakdown": {{
                "keyword_match": 0-100,
                "skills_match": 0-100,
                "experience_match": 0-100,
                "education_match": 0-100,
                "format_compatibility": 0-100
            }},
            "matched_keywords": [],
            "missing_keywords": [],
            "recommendations": []
        }}
        """
        
        try:
            response = model.generate_content(prompt)
            cleaned = response.text.strip().replace("```json", "").replace("```", "")
            return json.loads(cleaned)
        except:
            return {
                "total_score": 70,
                "breakdown": {
                    "keyword_match": 70,
                    "skills_match": 70,
                    "experience_match": 70,
                    "education_match": 70,
                    "format_compatibility": 70
                },
                "matched_keywords": [],
                "missing_keywords": [],
                "recommendations": ["Review and optimize your resume"]
            }
    
    @staticmethod
    def build_complete_resume(student_data: dict, job_title: str = None, jd_content: str = None) -> dict:
        """
        Main function to build complete personalized resume
        """
        # Check if AI service is available
        if not GENAI_AVAILABLE:
            return {
                "success": False,
                "message": "AI Resume Builder service is not configured. Please configure GEMINI_API_KEY to enable AI features.",
                "resume": {
                    "formatted_resume": "",
                    "suggestions": [],
                    "optimization_tips": [],
                    "match_analysis": {}
                }
            }
        
        print("🚀 Starting AI Resume Builder...")
        
        # Step 1: Parse JD if provided
        job_data = {}
        if jd_content:
            print("📄 Parsing Job Description...")
            job_data = AIResumeBuilder.parse_jd_file(jd_content, "text")
        elif job_title:
            job_data = {"job_title": job_title, "required_skills": []}
        
        # Step 2: Extract keywords from JD
        keywords = []
        if jd_content:
            keywords = AIResumeBuilder.extract_keywords_from_jd(jd_content)
        
        # Step 3: Analyze student against job
        print("🔍 Analyzing student profile...")
        analysis = AIResumeBuilder.analyze_student_profile(student_data, job_data)
        
        # Step 4: Generate optimized summary
        print("📝 Generating professional summary...")
        optimized_summary = AIResumeBuilder.generate_ats_optimized_summary(
            student_data, job_data, analysis
        )
        
        # Step 5: Prioritize skills
        print("🎯 Prioritizing skills...")
        prioritized_skills = AIResumeBuilder.prioritize_skills_by_job(
            student_data.get('technical_skills', []),
            job_data.get('required_skills', [])
        )
        
        # Step 6: Enhance projects
        print("🚀 Enhancing project descriptions...")
        enhanced_projects = AIResumeBuilder.enhance_project_descriptions(
            student_data.get('projects', []),
            job_data,
            analysis.get('matched_skills', [])
        )
        
        # Step 7: Enhance achievements
        print("🏆 Enhancing achievements...")
        enhanced_achievements = AIResumeBuilder.generate_achievement_bullets(
            student_data.get('achievements', []),
            job_data
        )
        
        # Step 8: Calculate ATS score
        print("📊 Calculating ATS score...")
        ats_result = AIResumeBuilder.calculate_ats_score(
            student_data, job_data, keywords
        )
        
        # Step 9: Build final resume
        final_resume = {
            "personal_info": {
                "name": student_data.get('name', ''),
                "email": student_data.get('email', ''),
                "phone": student_data.get('phone', ''),
                "location": student_data.get('location', ''),
                "linkedin": student_data.get('linkedin', ''),
                "github": student_data.get('github', ''),
                "portfolio": student_data.get('portfolio', '')
            },
            "target_job": {
                "title": job_data.get('job_title', job_title),
                "industry": job_data.get('industry', ''),
                "match_percentage": analysis.get('match_percentage', 0)
            },
            "professional_summary": optimized_summary,
            "skills": {
                "technical_skills": prioritized_skills,
                "tools": student_data.get('tools', []),
                "languages": student_data.get('languages', []),
                "soft_skills": student_data.get('soft_skills', [])
            },
            "projects": enhanced_projects,
            "experience": student_data.get('experience', []),
            "internships": student_data.get('internships', []),
            "education": {
                "degree": student_data.get('degree', ''),
                "university": student_data.get('university', ''),
                "graduation_year": student_data.get('graduation_year', ''),
                "cgpa": student_data.get('cgpa', ''),
                "course": student_data.get('course', ''),
                "branch": student_data.get('branch', '')
            },
            "certifications": student_data.get('certifications', []),
            "achievements": enhanced_achievements,
            "ats_analysis": {
                "score": ats_result.get('total_score', 0),
                "breakdown": ats_result.get('breakdown', {}),
                "matched_keywords": ats_result.get('matched_keywords', []),
                "missing_keywords": ats_result.get('missing_keywords', []),
                "recommendations": ats_result.get('recommendations', [])
            },
            "skill_gap_analysis": {
                "matched_skills": analysis.get('matched_skills', []),
                "missing_skills": analysis.get('missing_skills', []),
                "improvement_suggestions": analysis.get('improvement_suggestions', [])
            }
        }
        
        print("✅ Resume building complete!")
        return final_resume

# Convenience function for the router
def build_personalized_resume(student_data: dict, job_title: str = None, jd_content: str = None):
    """
    Wrapper function for the router
    """
    return AIResumeBuilder.build_complete_resume(student_data, job_title, jd_content)