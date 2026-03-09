"""Gemini API Client - Replacement for OpenAI"""
import google.generativeai as genai
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def call_openai(prompt: str):
    """Legacy function name kept for compatibility - now uses Gemini"""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Gemini API error: {str(e)}")
        raise Exception(f"Failed to generate content with Gemini: {str(e)}")
