#!/usr/bin/env python3
"""
Verification Script for Company Quiz System
Validates setup and runs basic tests
"""

import sys
import os
from pathlib import Path

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


def print_header(title):
    print(f"\n{BLUE}{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}{RESET}\n")


def print_success(msg):
    print(f"{GREEN}✅ {msg}{RESET}")


def print_error(msg):
    print(f"{RED}❌ {msg}{RESET}")


def print_warning(msg):
    print(f"{YELLOW}⚠️  {msg}{RESET}")


def print_info(msg):
    print(f"{BLUE}ℹ️  {msg}{RESET}")


def check_file_exists(filepath, description):
    """Check if a file exists"""
    if Path(filepath).exists():
        print_success(f"{description} exists")
        return True
    else:
        print_error(f"{description} NOT found at {filepath}")
        return False


def check_python_packages():
    """Check if required packages are installed"""
    print_header("Checking Python Packages")
    
    packages = {
        'fastapi': 'FastAPI',
        'sqlalchemy': 'SQLAlchemy',
        'pydantic': 'Pydantic',
        'google.generativeai': 'Google Generative AI',
        'psycopg2': 'PostgreSQL adapter',
    }
    
    all_ok = True
    for package, name in packages.items():
        try:
            __import__(package)
            print_success(f"{name} installed")
        except ImportError:
            print_error(f"{name} NOT installed - run: pip install {package.split('.')[0]}")
            all_ok = False
    
    return all_ok


def check_environment_variables():
    """Check if required environment variables are set"""
    print_header("Checking Environment Variables")
    
    env_file = Path('.env')
    if not env_file.exists():
        print_error(".env file not found - create one using ENV_SETUP_GUIDE.md")
        return False
    
    required_vars = {
        'DATABASE_URL': 'Database connection URL',
        'SECRET_KEY': 'JWT secret key',
        'ALGORITHM': 'JWT algorithm',
        'GEMINI_API_KEY': 'Gemini API key',
    }
    
    all_ok = True
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        for var, description in required_vars.items():
            value = os.getenv(var)
            if value:
                # Show partial value for security
                if len(value) > 20:
                    display = value[:10] + '...' + value[-10:]
                else:
                    display = '*' * len(value)
                print_success(f"{description} ({var}): {display}")
            else:
                print_error(f"{description} ({var}) NOT set in .env")
                all_ok = False
    except ImportError:
        print_error("python-dotenv not installed - run: pip install python-dotenv")
        all_ok = False
    
    return all_ok


def check_database_connection():
    """Check if database connection works"""
    print_header("Checking Database Connection")
    
    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text
        
        print_info(f"Attempting connection to: {settings.DATABASE_URL[:30]}...")
        engine = create_engine(settings.DATABASE_URL)
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print_success("Database connection successful ✓")
        
        return True
    except Exception as e:
        print_error(f"Database connection failed: {str(e)}")
        print_warning("Make sure PostgreSQL is running and DATABASE_URL is correct")
        return False


def check_gemini_api():
    """Check if Gemini API is accessible"""
    print_header("Checking Gemini API")
    
    try:
        from app.core.config import settings
        import google.generativeai as genai
        
        print_info(f"API Key: {settings.GEMINI_API_KEY[:15]}...")
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Try to initialize model
        model = genai.GenerativeModel('gemini-1.5-flash')
        print_success("Gemini API configured ✓")
        print_warning("Note: Full API test requires actual generation call (costs API quota)")
        
        return True
    except Exception as e:
        print_error(f"Gemini API check failed: {str(e)}")
        print_warning("Get API key from: https://makersuite.google.com/app/apikey")
        return False


def check_required_files():
    """Check if all new files were created"""
    print_header("Checking Created Files")
    
    files = {
        'app/models/company_quiz.py': 'Company Quiz Models',
        'app/services/gemini_service.py': 'Gemini Service',
        'app/routers/company_quiz.py': 'Quiz Router',
        'app/schemas/company_quiz.py': 'Quiz Schemas',
        'alembic/versions/add_company_quiz_tables.py': 'Database Migration',
    }
    
    all_ok = True
    for filepath, description in files.items():
        if check_file_exists(filepath, description):
            continue
        else:
            all_ok = False
    
    return all_ok


def check_migrations():
    """Check if migrations are applied"""
    print_header("Checking Migrations")
    
    try:
        from app.models.company_quiz import Company, QuizLevel, CompanyQuestion, QuizSession, SessionAnswer
        from app.database.database import engine
        from sqlalchemy import inspect
        
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        required_tables = [
            'companies',
            'quiz_levels',
            'company_questions',
            'quiz_sessions',
            'session_answers'
        ]
        
        all_ok = True
        for table in required_tables:
            if table in tables:
                print_success(f"Table '{table}' exists")
            else:
                print_error(f"Table '{table}' NOT found - run: alembic upgrade head")
                all_ok = False
        
        return all_ok
    except Exception as e:
        print_warning(f"Migration check incomplete: {str(e)}")
        print_info("Run: alembic upgrade head")
        return False


def run_all_checks():
    """Run all verification checks"""
    print(f"\n{BLUE}{'='*60}")
    print("  🔍 Company Quiz System - Verification Script")
    print(f"{'='*60}{RESET}")
    
    results = {}
    
    # Run checks
    results['Python Packages'] = check_python_packages()
    results['Environment Variables'] = check_environment_variables()
    results['Required Files'] = check_required_files()
    results['Database Connection'] = check_database_connection()
    results['Gemini API'] = check_gemini_api()
    results['Migrations'] = check_migrations()
    
    # Summary
    print_header("📋 Verification Summary")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for check, result in results.items():
        status = f"{GREEN}✅ PASS{RESET}" if result else f"{RED}❌ FAIL{RESET}"
        print(f"  {check:.<40} {status}")
    
    print(f"\n  {BLUE}Result: {passed}/{total} checks passed{RESET}")
    
    if passed == total:
        print_success("All checks passed! System is ready to use. 🚀")
        return True
    elif passed >= total - 1:
        print_warning("Most checks passed. Review errors above.")
        return True
    else:
        print_error("Several checks failed. Fix issues before proceeding.")
        return False


def print_next_steps():
    """Print next steps"""
    print_header("📚 Next Steps")
    
    print("""
1. Read QUICK_START_GUIDE.md for setup instructions

2. If database tables are missing:
   cd backend
   alembic upgrade head

3. Start the backend:
   uvicorn main:app --reload

4. Test the API:
   http://localhost:8000/docs

5. Add frontend component to React app

6. Read DOCUMENTATION_INDEX.md for all available docs
    """)


if __name__ == '__main__':
    try:
        success = run_all_checks()
        print_next_steps()
        
        sys.exit(0 if success else 1)
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        sys.exit(1)
