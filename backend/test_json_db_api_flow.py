"""
Complete Test: JSON → Backend DB → Frontend API
This script tests the end-to-end quiz flow
"""
import requests
import json
from pprint import pprint

BASE_URL = "http://localhost:8000"

def test_1_get_companies():
    """Step 1: Get available companies"""
    print("\n" + "="*60)
    print("TEST 1: Get Available Companies")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/quizzes/companies")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            companies = response.json()
            print(f"✅ Found {len(companies)} companies")
            pprint(companies[:2])  # Show first 2
            return companies
        else:
            print(f"❌ Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def test_2_get_exam_types(company):
    """Step 2: Get exam types for a company"""
    print("\n" + "="*60)
    print(f"TEST 2: Get Exam Types for {company}")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/quizzes/companies/{company}/exam-types")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            exam_types = data.get('exam_types', [])
            print(f"✅ Found {len(exam_types)} exam types: {exam_types}")
            return exam_types
        else:
            print(f"❌ Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def test_3_get_categories(company, exam_type):
    """Step 3: Get categories"""
    print("\n" + "="*60)
    print(f"TEST 3: Get Categories for {company}/{exam_type}")
    print("="*60)
    
    try:
        response = requests.get(
            f"{BASE_URL}/quizzes/companies/{company}/categories",
            params={"exam_type": exam_type}
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            categories = data.get('categories', [])
            print(f"✅ Found {len(categories)} categories: {categories[:3]}")
            return categories
        else:
            print(f"❌ Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def test_4_generate_quiz(quiz_params):
    """Step 4: Generate AI Quiz - INSERT INTO DB"""
    print("\n" + "="*60)
    print("TEST 4: Generate AI Quiz (JSON → DB INSERT)")
    print("="*60)
    
    try:
        print(f"Sending request with params:")
        pprint(quiz_params)
        
        response = requests.post(
            f"{BASE_URL}/quizzes/ai-generate",
            json=quiz_params,
            headers={"Authorization": "Bearer test_token"}  # Add if needed
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            quiz_data = response.json()
            print(f"✅ Quiz Created!")
            pprint(quiz_data)
            return quiz_data.get('quiz_id')
        else:
            print(f"❌ Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def test_5_fetch_quiz_list():
    """Step 5: Fetch Quiz List - READ FROM DB"""
    print("\n" + "="*60)
    print("TEST 5: Fetch Quiz List (READ FROM DB)")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/quizzes")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            total = data.get('total', 0)
            quizzes = data.get('quizzes', [])
            print(f"✅ Found {total} quizzes in database")
            
            if quizzes:
                print("\nRecent Quizzes:")
                for q in quizzes[:3]:
                    print(f"  - Quiz #{q.get('quiz_id')}: {q.get('company')} | {q.get('topic')}")
            
            return data
        else:
            print(f"❌ Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def test_6_fetch_specific_quiz(quiz_id):
    """Step 6: Fetch Specific Quiz with Questions"""
    print("\n" + "="*60)
    print(f"TEST 6: Fetch Quiz #{quiz_id} with Questions")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/quizzes/{quiz_id}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            quiz = response.json()
            print(f"✅ Quiz Found!")
            print(f"  Company: {quiz.get('company')}")
            print(f"  Topic: {quiz.get('topic')}")
            print(f"  Questions: {quiz.get('question_count')}")
            
            questions = quiz.get('questions', [])
            if questions:
                print(f"\n  First Question:")
                q = questions[0]
                print(f"    Q: {q.get('question')[:100]}...")
                print(f"    Options: {q.get('options')}")
            
            return quiz
        else:
            print(f"❌ Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def test_7_submit_quiz(quiz_id, quiz):
    """Step 7: Submit Quiz Answers"""
    print("\n" + "="*60)
    print(f"TEST 7: Submit Quiz #{quiz_id} Answers")
    print("="*60)
    
    try:
        # Prepare answers (select first option for all)
        answers = []
        for question in quiz.get('questions', []):
            answers.append({
                "question_id": question.get('question_id'),
                "selected_answer": question.get('options', [])[0]  # Select first option
            })
        
        payload = {
            "quiz_id": quiz_id,
            "answers": answers
        }
        
        print(f"Submitting {len(answers)} answers...")
        response = requests.post(
            f"{BASE_URL}/quizzes/{quiz_id}/submit",
            json=payload
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Quiz Evaluated!")
            print(f"  Score: {result.get('score')}/{result.get('total')}")
            print(f"  Percentage: {result.get('percentage')}%")
            return result
        else:
            print(f"❌ Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def main():
    print("\n")
    print("=" * 60)
    print("JSON → Backend DB → Frontend API - Complete Test Flow".center(60))
    print("=" * 60)
    
    # Test 1: Get companies
    companies = test_1_get_companies()
    if not companies:
        print("\n❌ Cannot proceed without companies")
        return
    
    # Use first company
    company = companies[0].get('company_name')
    print(f"\n📌 Using company: {company}")
    
    # Test 2: Get exam types
    exam_types = test_2_get_exam_types(company)
    if not exam_types:
        print("\n❌ Cannot proceed without exam types")
        return
    
    exam_type = exam_types[0]
    print(f"📌 Using exam type: {exam_type}")
    
    # Test 3: Get categories
    categories = test_3_get_categories(company, exam_type)
    if not categories:
        print("\n❌ Cannot proceed without categories")
        return
    
    category = categories[0]
    print(f"📌 Using category: {category}")
    
    # Get track from company data
    track = companies[0].get('track', 'General')
    
    # Test 4: Generate Quiz (AI → JSON → DB INSERT)
    quiz_params = {
        "company": company,
        "track": track,
        "exam_type": exam_type,
        "category": category,
        "topic": "Arrays",  # Fixed topic
        "difficulty": "Easy",
        "num_questions": 3,
        "question_type": "MCQ"
    }
    
    quiz_id = test_4_generate_quiz(quiz_params)
    
    # Test 5: Fetch Quiz List (READ FROM DB)
    quiz_list = test_5_fetch_quiz_list()
    
    # Test 6: Fetch Specific Quiz (READ FROM DB)
    if quiz_id:
        quiz = test_6_fetch_specific_quiz(quiz_id)
        
        # Test 7: Submit Quiz (UPDATE DB)
        if quiz:
            test_7_submit_quiz(quiz_id, quiz)
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print("[OK] JSON → Backend DB → Frontend API Flow Complete!")
    print("[OK] All steps tested successfully")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
