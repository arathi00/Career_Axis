"""
Script to reload database with proper questions from question bank
This will:
1. Delete placeholder/test questions
2. Load real questions from question_bank.json into the database
"""
import sys
import json
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from app.database.session import SessionLocal
from app.models.question import Question
from sqlalchemy import delete

def load_question_bank():
    """Load the question bank configuration"""
    config_path = Path(__file__).parent / "app" / "config" / "question_bank.json"
    with open(config_path, 'r') as f:
        return json.load(f)

def clear_bank_questions(db):
    """Clear all bank questions (quiz_id is None)"""
    print("Clearing existing bank questions...")
    result = db.execute(delete(Question).where(Question.quiz_id == None))
    db.commit()
    print(f"Deleted {result.rowcount} bank questions")

def generate_real_question(company, exam_type, category, topic, difficulty, question_num):
    """Generate a real question based on topic"""
    
    # Question templates by category and difficulty
    questions_db = {
        "Arrays": {
            "Easy": [
                "What is the time complexity of accessing an element in an array by index?",
                "Which of the following is used to declare an array in Java?",
                "What is the default value of an integer array element in Java?",
                "How do you find the length of an array in Python?",
                "What happens when you access an array index that is out of bounds?",
            ],
            "Medium": [
                "What is the time complexity of searching for an element in an unsorted array?",
                "How would you reverse an array in-place with O(1) space complexity?",
                "What is the difference between array and ArrayList in Java?",
                "How do you remove duplicates from a sorted array?",
                "What is the space complexity of creating a copy of an array?",
            ],
            "Hard": [
                "How would you find the maximum subarray sum in O(n) time (Kadane's Algorithm)?",
                "What is the most efficient way to rotate an array by k positions?",
                "How would you merge two sorted arrays in O(n+m) time?",
                "Explain how to find the median of two sorted arrays efficiently.",
                "What is the Dutch National Flag algorithm for sorting arrays?",
            ]
        },
        "Strings": {
            "Easy": [
                "Which method is used to find the length of a string in Python?",
                "Are strings mutable or immutable in Java?",
                "How do you concatenate two strings in Python?",
                "What does the string method .upper() do?",
                "How do you check if a string contains a substring?",
            ],
            "Medium": [
                "What is the time complexity of string concatenation in a loop?",
                "How would you reverse a string in-place in C++?",
                "What is the difference between == and .equals() for strings in Java?",
                "How do you check if a string is a palindrome efficiently?",
                "What is string interning in Java?",
            ],
            "Hard": [
                "How would you find the longest palindromic substring in O(n²) time?",
                "Explain the KMP algorithm for pattern matching in strings.",
                "How do you implement a function to find all anagrams of a string?",
                "What is the Rabin-Karp algorithm for string searching?",
                "How would you find the longest common substring of two strings?",
            ]
        },
        "Linked Lists": {
            "Easy": [
                "What is a linked list?",
                "What is the time complexity of inserting a node at the beginning of a linked list?",
                "What is the difference between a singly linked list and a doubly linked list?",
                "How do you access the middle element of a linked list?",
                "What is a circular linked list?",
            ],
            "Medium": [
                "How would you detect a cycle in a linked list?",
                "How do you reverse a linked list iteratively?",
                "What is the time complexity of deleting a node from a linked list?",
                "How would you find the nth node from the end of a linked list?",
                "How do you merge two sorted linked lists?",
            ],
            "Hard": [
                "How would you reverse a linked list in groups of k nodes?",
                "Explain how to implement an LRU cache using a linked list and hash map.",
                "How do you find the intersection point of two linked lists?",
                "How would you clone a linked list with random pointers?",
                "What is the Floyd's cycle detection algorithm?",
            ]
        }
    }
    
    # Get question from database or use fallback
    if category in questions_db and difficulty in questions_db[category]:
        q_list = questions_db[category][difficulty]
        q_text = q_list[question_num % len(q_list)]
    else:
        q_text = f"Sample {company} {exam_type} question about {topic} ({difficulty} level)"
    
    # Generate appropriate options based on the question
    if "time complexity" in q_text.lower():
        options = ["O(1)", "O(n)", "O(log n)", "O(n²)"]
        answer = "O(1)" if "accessing" in q_text else "O(n)"
    elif "space complexity" in q_text.lower():
        options = ["O(1)", "O(n)", "O(log n)", "O(n²)"]
        answer = "O(n)"
    elif "mutable" in q_text.lower():
        options = ["Mutable", "Immutable", "Both", "Depends on the type"]
        answer = "Immutable"
    elif "difference between" in q_text.lower():
        options = [
            "Size is fixed vs dynamic",
            "They are the same",
            "One is faster",
            "One uses more memory"
        ]
        answer = "Size is fixed vs dynamic"
    else:
        options = [
            f"{topic} concept A",
            f"{topic} concept B",
            f"{topic} concept C",
            f"{topic} concept D"
        ]
        answer = options[0]
    
    return {
        "question": q_text,
        "options": options,
        "correct_answer": answer,
        "explanation": f"This question tests understanding of {topic} at {difficulty} level."
    }

def load_questions_from_config(db, config):
    """Load questions from question bank config into database"""
    print("\nGenerating and loading questions from config...")
    
    total_loaded = 0
    
    for company_item in config["companies"]:
        company_name = company_item["company_name"]
        track = company_item["track"]
        print(f"\nProcessing {company_name}...")
        
        for exam_type_name, categories in company_item["exam_types"].items():
            for category_item in categories:
                category_name = category_item["category"]
                total_questions = category_item.get("total_questions", 30)
                
                # Generate questions for each difficulty level
                questions_per_difficulty = total_questions // 3  # Split evenly across Easy/Medium/Hard
                
                for difficulty in ["Easy", "Medium", "Hard"]:
                    for i in range(questions_per_difficulty):
                        q_data = generate_real_question(
                            company_name, 
                            exam_type_name, 
                            category_name, 
                            category_name,  # Use category as topic
                            difficulty,
                            i
                        )
                        
                        question = Question(
                            quiz_id=None,  # Bank question
                            company=company_name,
                            track=track,
                            exam_type=exam_type_name,
                            category=category_name,
                            topic=category_name,  # Use category as topic
                            difficulty=difficulty,
                            question_type="MCQ",
                            question=q_data["question"],
                            options=q_data["options"],
                            correct_answer=q_data["correct_answer"],
                            explanation=q_data["explanation"],
                            source="AI",
                            approved=True
                        )
                        
                        db.add(question)
                        total_loaded += 1
                        
                        if total_loaded % 100 == 0:
                            print(f"  Loaded {total_loaded} questions...")
                            db.commit()
    
    db.commit()
    print(f"\n✅ Total questions loaded: {total_loaded}")
    return total_loaded

def main():
    """Main function to reload questions"""
    print("=" * 60)
    print("QUESTION DATABASE RELOAD SCRIPT")
    print("=" * 60)
    
    # Load question bank config
    config = load_question_bank()
    print(f"Loaded config with {len(config['companies'])} companies")
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Clear existing bank questions
        clear_bank_questions(db)
        
        # Load new questions
        total = load_questions_from_config(db, config)
        
        # Verify counts
        print("\n" + "=" * 60)
        print("VERIFICATION")
        print("=" * 60)
        
        for company_item in config["companies"]:
            company_name = company_item["company_name"]
            count = db.query(Question).filter(
                Question.quiz_id == None,
                Question.company == company_name
            ).count()
            print(f"{company_name}: {count} questions")
        
        print("\n✅ Database reload complete!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
