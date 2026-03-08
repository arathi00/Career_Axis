"""
Question Bank Service - Manages company question banks
Validates question availability and AI generation rules
"""
import json
import os
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from app.models.question import Question
from app.models.quiz import Quiz
from app.utils.logger import logger


class QuestionBankService:
    """Service to manage question bank configuration and validation"""
    
    def __init__(self):
        """Load question bank from JSON configuration"""
        config_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            'config',
            'question_bank.json'
        )
        
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        logger.info(f"Loaded question bank for {len(self.config['companies'])} companies")
    
    def get_all_companies(self) -> List[Dict]:
        """Get list of all companies with their tracks"""
        companies = {}

        # Aggregate tracks per company name to support multiple tracks in future
        for company in self.config["companies"]:
            name = company["company_name"]
            track = company.get("track")

            if name not in companies:
                companies[name] = {
                    "company_id": None,
                    "company_name": name,
                    "track": None,
                    "tracks": []
                }

            if track and track not in companies[name]["tracks"]:
                companies[name]["tracks"].append(track)
                # Set primary track for backward compatibility
                companies[name]["track"] = companies[name]["track"] or track

        return list(companies.values())
    
    def get_company_config(self, company_name: str) -> Optional[Dict]:
        """Get full configuration for a specific company"""
        for company in self.config["companies"]:
            if company["company_name"].lower() == company_name.lower():
                return company
        return None
    
    def get_exam_types(self, company_name: str) -> List[str]:
        """Get available exam types for a company"""
        company = self.get_company_config(company_name)
        if not company:
            return []
        return list(company.get("exam_types", {}).keys())
    
    def get_categories(self, company_name: str, exam_type: Optional[str] = None) -> List[Dict]:
        """
        Get available categories for a company and optional exam type
        Returns: [{"category": "Arrays", "total_questions": 15, "exam_type": "Technical"}, ...]
        """
        company = self.get_company_config(company_name)
        if not company:
            return []
        
        exam_types = company.get("exam_types", {})
        
        if exam_type:
            # Return categories for specific exam type
            categories = exam_types.get(exam_type, [])
            return [
                {**cat, "exam_type": exam_type}
                for cat in categories
            ]
        else:
            # Return all categories across all exam types
            all_categories = []
            for et, cats in exam_types.items():
                for cat in cats:
                    all_categories.append({**cat, "exam_type": et})
            return all_categories
    
    def get_max_questions(self, company_name: str, category: str) -> int:
        """Get maximum available questions for a company/category"""
        categories = self.get_categories(company_name)
        for cat in categories:
            if cat["category"].lower() == category.lower():
                return cat["total_questions"]
        return 0
    
    def validate_quiz_request(
        self,
        db: Session,
        company: str,
        track: str,
        exam_type: str,
        category: str,
        topic: str,
        num_questions: int
    ) -> Dict[str, any]:
        """
        Validate quiz generation request against question bank limits
        Returns: {
            "valid": bool,
            "message": str,
            "max_available": int,
            "db_count": int,
            "needs_ai": bool
        }
        """
        # Check if company exists in config
        company_config = self.get_company_config(company)
        if not company_config:
            return {
                "valid": False,
                "message": f"Company '{company}' not found in question bank",
                "max_available": 0,
                "db_count": 0,
                "needs_ai": False
            }
        
        # Check if exam_type exists
        if exam_type not in company_config.get("exam_types", {}):
            return {
                "valid": False,
                "message": f"Exam type '{exam_type}' not available for {company}",
                "max_available": 0,
                "db_count": 0,
                "needs_ai": False
            }
        
        # Get max questions for this category
        max_questions = self.get_max_questions(company, category)
        
        if max_questions == 0:
            return {
                "valid": False,
                "message": f"Category '{category}' not found for {company}",
                "max_available": 0,
                "db_count": 0,
                "needs_ai": False
            }
        
        # Check if requested questions exceed max
        if num_questions > max_questions:
            return {
                "valid": False,
                "message": f"Requested {num_questions} questions but only {max_questions} available for {category}",
                "max_available": max_questions,
                "db_count": 0,
                "needs_ai": False
            }
        
        # Count existing questions in database for this topic
        db_count = db.query(Question).filter(
            Question.company == company,
            Question.track == track,
            Question.exam_type == exam_type,
            Question.category == category,
            Question.topic == topic
        ).count()
        
        # Determine if AI generation is needed
        needs_ai = db_count < num_questions
        
        return {
            "valid": True,
            "message": "Validation successful",
            "max_available": max_questions,
            "db_count": db_count,
            "needs_ai": needs_ai,
            "ai_generate_count": max(0, num_questions - db_count)
        }
    
    def get_available_topics(
        self,
        db: Session,
        company: str,
        track: str,
        exam_type: str,
        category: str
    ) -> List[Dict]:
        """
        Get list of topics that have questions in database
        Returns: [{"topic": "Binary Search", "count": 5}, ...]
        """
        from sqlalchemy import func
        
        topics = db.query(
            Question.topic,
            func.count(Question.id).label('count')
        ).filter(
            Question.company == company,
            Question.track == track,
            Question.exam_type == exam_type,
            Question.category == category
        ).group_by(Question.topic).all()
        
        return [
            {"topic": topic, "count": count}
            for topic, count in topics
        ]
    
    def get_question_bank_stats(self, db: Session) -> Dict:
        """Get overall statistics about question bank"""
        from sqlalchemy import func
        
        total_companies = len(self.config["companies"])
        
        # Count total configured questions
        total_configured = 0
        for company in self.config["companies"]:
            for exam_type, categories in company.get("exam_types", {}).items():
                for cat in categories:
                    total_configured += cat["total_questions"]
        
        # Count questions in database
        total_in_db = db.query(func.count(Question.id)).scalar()
        
        # Get per-company stats
        company_stats = []
        for company in self.config["companies"]:
            company_name = company["company_name"]
            db_count = db.query(func.count(Question.id)).filter(
                Question.company == company_name
            ).scalar()
            
            configured_count = 0
            for exam_type, categories in company.get("exam_types", {}).items():
                for cat in categories:
                    configured_count += cat["total_questions"]
            
            company_stats.append({
                "company": company_name,
                "track": company["track"],
                "configured": configured_count,
                "in_database": db_count,
                "completion_percentage": round((db_count / configured_count * 100) if configured_count > 0 else 0, 2)
            })
        
        return {
            "total_companies": total_companies,
            "total_configured_questions": total_configured,
            "total_questions_in_db": total_in_db,
            "overall_completion": round((total_in_db / total_configured * 100) if total_configured > 0 else 0, 2),
            "company_stats": company_stats
        }


# Singleton instance
question_bank_service = QuestionBankService()
