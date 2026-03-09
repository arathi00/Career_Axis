#!/usr/bin/env python3
"""
Load all questions from question_bank.json into the database
"""

import sys
import json
from pathlib import Path
from sqlalchemy.orm import Session

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.database.session import SessionLocal
from app.models.question import Question
from app.models.quiz import Quiz


def load_question_bank_to_db():
    """Load all questions from question_bank.json into database as bank questions (quiz_id=NULL)"""
    
    # Load question bank
    question_bank_path = Path(__file__).parent / "app/config/question_bank.json"
    with open(question_bank_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    db = SessionLocal()
    
    try:
        # Count existing questions
        existing_count = db.query(Question).filter(Question.quiz_id == None).count()
        print(f"Existing bank questions: {existing_count}")
        
        # Ask for confirmation if questions exist
        if existing_count > 0:
            response = input(f"Found {existing_count} existing bank questions. Delete and reload? (yes/no): ")
            if response.lower() != 'yes':
                print("Operation cancelled.")
                return
            
            # Delete existing bank questions
            db.query(Question).filter(Question.quiz_id == None).delete()
            db.commit()
            print(f"Deleted {existing_count} existing bank questions")
        
        total_loaded = 0
        
        # Iterate through companies
        for company_data in data.get("companies", []):
            company_name = company_data["company_name"]
            track = company_data["track"]
            
            print(f"\nLoading questions for {company_name} - {track}")
            
            # Iterate through exam types
            for exam_type, categories in company_data.get("exam_types", {}).items():
                for category_data in categories:
                    category = category_data["category"]
                    total_questions = category_data["total_questions"]
                    
                    print(f"  {exam_type} > {category}: {total_questions} questions")
                    
                    # Generate questions for each category
                    for i in range(total_questions):
                        # Alternate difficulty levels
                        if i < total_questions // 3:
                            difficulty = "Easy"
                        elif i < 2 * total_questions // 3:
                            difficulty = "Medium"
                        else:
                            difficulty = "Hard"
                        
                        # Create sample question
                        question = Question(
                            quiz_id=None,  # Bank question (not part of any quiz)
                            company=company_name,
                            track=track,
                            exam_type=exam_type,
                            category=category,
                            topic=category,  # Using category as topic for now
                            difficulty=difficulty,
                            question_type="MCQ",
                            question=f"{company_name} {exam_type} - {category} question {i+1}: Sample question about {category}",
                            options=[
                                f"Option A for question {i+1}",
                                f"Option B for question {i+1}",
                                f"Option C for question {i+1}",
                                f"Option D for question {i+1}"
                            ],
                            correct_answer=f"Option A for question {i+1}",  # Default to option A
                            explanation=f"This is a sample {difficulty} question about {category}. In a real scenario, this would contain a detailed explanation.",
                            source="question_bank",
                            approved=True
                        )
                        
                        db.add(question)
                        total_loaded += 1
                    
                    # Commit after each category
                    db.commit()
        
        print(f"\n✅ Successfully loaded {total_loaded} questions into the database!")
        print(f"\nBreakdown by company:")
        
        # Show summary
        for company_data in data.get("companies", []):
            company_name = company_data["company_name"]
            count = db.query(Question).filter(
                Question.company == company_name,
                Question.quiz_id == None
            ).count()
            print(f"  {company_name}: {count} questions")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error loading questions: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


def load_sample_json_files():
    """Load questions from sample JSON files (tcs-aptitude.json, infosys-technical-cse.json)"""
    
    sample_dir = Path(__file__).parent / "sample_questions"
    db = SessionLocal()
    
    try:
        json_files = list(sample_dir.glob("*.json"))
        print(f"\nFound {len(json_files)} sample JSON files")
        
        total_loaded = 0
        
        for json_file in json_files:
            print(f"\nLoading {json_file.name}...")
            
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            company = data.get("company", "Unknown")
            section = data.get("section", "Technical")
            branch = data.get("branch", "ALL")
            
            # Map section to exam_type
            exam_type_map = {
                "Aptitude": "Aptitude",
                "Technical": "Technical",
                "Logical": "Logical"
            }
            exam_type = exam_type_map.get(section, section)
            
            for q_data in data.get("questions", []):
                question = Question(
                    quiz_id=None,  # Bank question
                    company=company,
                    track="Software Engineer",
                    exam_type=exam_type,
                    category=section,
                    topic=section,
                    difficulty=q_data.get("difficulty", "easy").capitalize(),
                    question_type="MCQ",
                    question=q_data["question"],
                    options=q_data["options"],
                    correct_answer=q_data["answer"],
                    explanation=f"Question from {json_file.name}",
                    source=q_data.get("source", "manual"),
                    approved=True
                )
                
                db.add(question)
                total_loaded += 1
            
            db.commit()
            print(f"  ✅ Loaded {len(data.get('questions', []))} questions")
        
        print(f"\n✅ Successfully loaded {total_loaded} questions from sample files!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error loading sample files: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


def main():
    print("="*60)
    print("Question Bank Data Loader")
    print("="*60)
    
    print("\nOptions:")
    print("1. Load questions from question_bank.json (generates sample questions)")
    print("2. Load questions from sample JSON files")
    print("3. Load both")
    
    choice = input("\nEnter your choice (1/2/3): ").strip()
    
    if choice == "1":
        load_question_bank_to_db()
    elif choice == "2":
        load_sample_json_files()
    elif choice == "3":
        load_question_bank_to_db()
        load_sample_json_files()
    else:
        print("Invalid choice!")
        return
    
    # Show final summary
    db = SessionLocal()
    try:
        total_bank = db.query(Question).filter(Question.quiz_id == None).count()
        total_quiz = db.query(Question).filter(Question.quiz_id != None).count()
        print(f"\n{'='*60}")
        print(f"FINAL DATABASE STATE:")
        print(f"  Bank questions (quiz_id=NULL): {total_bank}")
        print(f"  Quiz questions (quiz_id assigned): {total_quiz}")
        print(f"  Total questions: {total_bank + total_quiz}")
        print(f"{'='*60}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
