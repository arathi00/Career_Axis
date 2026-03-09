"""
Gemini API Service for Dynamic Question Generation
Integrates with Google's Gemini API to generate company-specific quiz questions
"""
import google.generativeai as genai
from typing import List, Dict, Any
import json
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiQuestionGenerator:
    """Generate quiz questions using Google Gemini API"""
    
    def __init__(self):
        """Initialize Gemini API with API key from settings"""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def generate_questions(
        self,
        company: str,
        difficulty: str,
        count: int = 10,
        topic: str = "Aptitude"
    ) -> List[Dict[str, Any]]:
        """
        Generate questions dynamically using Gemini API
        
        Args:
            company: Company name (e.g., "TCS", "Infosys")
            difficulty: Question difficulty (easy, medium, hard)
            count: Number of questions to generate
            topic: Question topic/category
            
        Returns:
            List of question dictionaries with structure:
            {
                "question_text": "...",
                "options": ["A", "B", "C", "D"],
                "correct_answer": "...",
                "explanation": "..."
            }
        """
        try:
            prompt = self._build_prompt(company, difficulty, count, topic)
            logger.info(f"Generating {count} {difficulty} questions for {company} - {topic}")
            
            response = self.model.generate_content(prompt)
            questions = self._parse_response(response.text)
            
            logger.info(f"Successfully generated {len(questions)} questions")
            return questions
            
        except Exception as e:
            logger.error(f"Error generating questions with Gemini: {str(e)}")
            raise Exception(f"Failed to generate questions: {str(e)}")
    
    def _build_prompt(self, company: str, difficulty: str, count: int, topic: str) -> str:
        """Build the prompt for Gemini API"""
        
        difficulty_descriptions = {
            "easy": "basic concepts, simple calculations, fundamental knowledge",
            "medium": "moderate complexity, multi-step problems, application of concepts",
            "hard": "complex scenarios, advanced problem-solving, analytical thinking"
        }
        
        prompt = f"""You are an expert question generator for {company} placement exams.

Generate EXACTLY {count} multiple-choice questions for {company} placement test.

**Requirements:**
- Topic: {topic}
- Difficulty Level: {difficulty} ({difficulty_descriptions.get(difficulty, '')})
- Company: {company}
- Each question must have EXACTLY 4 options
- Only ONE correct answer per question
- Include brief explanation for each answer

**Question Quality:**
- Follow {company}'s actual placement exam patterns
- Make distractors (wrong options) realistic and plausible
- For {difficulty} level, ensure appropriate complexity
- Include variety in question types within the topic

**Output Format (STRICT JSON):**
Return ONLY a valid JSON array, no markdown, no code blocks, no explanations outside JSON.

[
  {{
    "question_text": "Clear and complete question text here",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correct_answer": "Exact text of correct option",
    "explanation": "Brief explanation of why this is correct"
  }}
]

Generate {count} questions now:"""
        
        return prompt
    
    def _parse_response(self, response_text: str) -> List[Dict[str, Any]]:
        """Parse Gemini API response and extract questions"""
        try:
            # Remove markdown code blocks if present
            cleaned_text = response_text.strip()
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.startswith("```"):
                cleaned_text = cleaned_text[3:]
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]
            cleaned_text = cleaned_text.strip()
            
            # Parse JSON
            questions = json.loads(cleaned_text)
            
            # Validate structure
            if not isinstance(questions, list):
                raise ValueError("Response is not a list of questions")
            
            validated_questions = []
            for q in questions:
                if self._validate_question(q):
                    validated_questions.append(q)
            
            return validated_questions
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {str(e)}\nResponse: {response_text}")
            raise Exception("Failed to parse Gemini response as JSON")
    
    def _validate_question(self, question: Dict[str, Any]) -> bool:
        """Validate question structure"""
        required_fields = ["question_text", "options", "correct_answer"]
        
        # Check required fields
        for field in required_fields:
            if field not in question:
                logger.warning(f"Question missing required field: {field}")
                return False
        
        # Validate options
        if not isinstance(question["options"], list):
            logger.warning("Options is not a list")
            return False
        
        if len(question["options"]) != 4:
            logger.warning(f"Question has {len(question['options'])} options, expected 4")
            return False
        
        # Validate correct answer is in options
        if question["correct_answer"] not in question["options"]:
            logger.warning("Correct answer not found in options")
            return False
        
        return True


# Singleton instance
gemini_generator = GeminiQuestionGenerator()
