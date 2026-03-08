# 🔄 Complete API Flow & Examples

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  CompanyQuiz Component                                   │   │
│  │  - Select Company (TCS, Infosys, etc)                   │   │
│  │  - Select Difficulty (Easy, Medium, Hard)               │   │
│  │  - Display Quiz Questions                              │   │
│  │  - Show Timer & Progress                               │   │
│  │  - Submit Answers & Show Results                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                 HTTP Request / Response
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    BACKEND (FastAPI)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  router: company_quiz.py                                 │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │ POST /start                                       │   │   │
│  │  │ - Validate Company                                │   │   │
│  │  │ - Get/Create Quiz Level                           │   │   │
│  │  │ - Check DB for Questions                          │   │   │
│  │  │ - Call Gemini Service if needed                   │   │   │
│  │  │ - Return Questions to Frontend                    │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │ POST /submit                                      │   │   │
│  │  │ - Evaluate Answers                                │   │   │
│  │  │ - Calculate Score                                 │   │   │
│  │  │ - Return Results with Explanations                │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │ GET /history                                      │   │   │
│  │  │ - Return User's Quiz History                      │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                               │                                   │
│  ┌──────────────────────────┬─────────────────────────────────┐  │
│  │  Conditional Branch:     │                                 │  │
│  │  Questions in DB?        │                                 │  │
│  └──────────────────────────┼─────────────────────────────────┘  │
│                             │                                     │
│             ┌───────────────┴──────────────────┐                 │
│             │                                  │                 │
│         YES │                                  │ NO              │
│             │                                  │                 │
│             ▼                                  ▼                 │
│        ┌─────────────┐            ┌─────────────────────────┐   │
│        │ Return from │            │ Call Gemini Service     │   │
│        │    Cache    │            └─────────────────────────┘   │
│        │ (FAST!)     │                     │                    │
│        └─────────────┘                     ▼                    │
│                                  ┌─────────────────────────┐   │
│                                  │ Gemini API Call         │   │
│                                  │ - Generate Questions    │   │
│                                  │ - Validate JSON         │   │
│                                  │ - Parse Response        │   │
│                                  └─────────────────────────┘   │
│                                          │                      │
│                                          ▼                      │
│                                  ┌─────────────────────────┐   │
│                                  │ Store in Database       │   │
│                                  │ (Cache for next user)   │   │
│                                  └─────────────────────────┘   │
│                                          │                      │
└──────────────────────────────────────────┼──────────────────────┘
                                          │
                        ┌─────────────────┴──────────────┐
                        │                                │
                        ▼                                ▼
            ┌──────────────────────┐      ┌──────────────────────┐
            │   PostgreSQL DB      │      │  Gemini API Server   │
            │  (Cache Questions)   │      │  (Generate Q's)      │
            │                      │      │                      │
            │ - companies          │      │ models/gemini-pro    │
            │ - quiz_levels        │      │                      │
            │ - company_questions  │      │ Rate: 60 req/min     │
            │ - quiz_sessions      │      │ Cost: Free tier      │
            │ - session_answers    │      └──────────────────────┘
            └──────────────────────┘
```

## 📡 Step-by-Step API Flow

### Scenario: User Takes TCS Easy Quiz

#### Step 1️⃣: User Selects Quiz Settings

**Frontend:** User selects:
- Company: "TCS"
- Difficulty: "easy"
- Questions: 10

#### Step 2️⃣: Send Start Quiz Request

**Frontend → Backend:**

```http
POST /api/company-quiz/start HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "company": "TCS",
  "level": "easy",
  "count": 10,
  "topic": "Aptitude"
}
```

#### Step 3️⃣: Backend Processing

**Backend Logic:**

```
1. Check if TCS company exists
   ├─ If NO → Create company
   └─ If YES → Continue

2. Get TCS + easy level
   ├─ If doesn't exist → Create level
   └─ If exists → Continue

3. Count existing questions
   ├─ Query: SELECT COUNT(*) WHERE company_id=1 AND level_id=1
   └─ Result: 5 questions

4. Do we have enough?
   ├─ Need: 10 questions
   ├─ Have: 5 questions
   └─ Decision: CALL GEMINI API ✓

5. Generate via Gemini
   ├─ Send prompt to Gemini API
   ├─ Gemini returns 10 questions (JSON)
   ├─ Parse & validate responses
   ├─ Insert into company_questions table
   └─ Now have: 15 total questions

6. Select quiz questions
   ├─ Query: SELECT * LIMIT 10 (random)
   └─ Result: Array of 10 questions

7. Create session
   ├─ INSERT quiz_sessions (user_id, company_id, level_id)
   └─ Result: session_id = 42

8. Prepare response
   ├─ Remove correct_answer from response
   ├─ Return only: id, question_text, options
   └─ Ready to send
```

#### Step 4️⃣: Backend Response

**Backend → Frontend:**

```json
{
  "session_id": 42,
  "company": "TCS",
  "level": "easy",
  "total_questions": 10,
  "started_at": "2026-01-22T14:30:45.123456",
  "questions": [
    {
      "id": 101,
      "question_text": "What is the time complexity of binary search?",
      "options": [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(1)"
      ]
    },
    {
      "id": 102,
      "question_text": "Which sorting algorithm has the best average case?",
      "options": [
        "Bubble Sort",
        "Quick Sort",
        "Selection Sort",
        "Insertion Sort"
      ]
    },
    // ... 8 more questions
  ],
  "message": "Quiz started successfully"
}
```

#### Step 5️⃣: Frontend Displays Quiz

**Frontend State:**
```javascript
{
  quizStarted: true,
  sessionId: 42,
  currentQuestion: 0,
  totalQuestions: 10,
  timer: 600, // 10 minutes
  userAnswers: {
    101: null,  // Not answered yet
    102: null,
    // ...
  }
}
```

#### Step 6️⃣: User Answers Questions

**Frontend tracks answers:**
```javascript
// User clicks: "O(log n)"
userAnswers[101] = "O(log n)"

// User clicks: "Quick Sort"
userAnswers[102] = "Quick Sort"

// ... user continues
```

#### Step 7️⃣: User Submits Quiz

**Frontend → Backend:**

```http
POST /api/company-quiz/submit HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "session_id": 42,
  "answers": [
    {
      "question_id": 101,
      "selected_answer": "O(log n)"
    },
    {
      "question_id": 102,
      "selected_answer": "Quick Sort"
    },
    {
      "question_id": 103,
      "selected_answer": "Option A"
    },
    // ... 7 more answers
  ]
}
```

#### Step 8️⃣: Backend Evaluation

**Backend Logic:**

```
1. Fetch session: SELECT * FROM quiz_sessions WHERE id=42

2. For each answer:
   ├─ Fetch question: SELECT * FROM company_questions WHERE id=101
   ├─ Compare: selected_answer == correct_answer
   ├─ Store in session_answers table
   ├─ Increment score if correct
   └─ Store explanation

3. Calculate results:
   ├─ Score: 8 correct out of 10
   ├─ Percentage: 80.0%
   ├─ Time: 12 minutes (exceeds limit, but allowed)
   └─ Status: "completed"

4. Update session:
   ├─ UPDATE quiz_sessions SET score=8, completed_at=NOW()
   └─ UPDATE quiz_sessions SET status='completed'
```

#### Step 9️⃣: Backend Returns Results

**Backend → Frontend:**

```json
{
  "session_id": 42,
  "company": "TCS",
  "level": "easy",
  "score": 8,
  "total": 10,
  "percentage": 80.0,
  "status": "completed",
  "completed_at": "2026-01-22T14:42:30.654321",
  "answers": [
    {
      "question_id": 101,
      "question_text": "What is the time complexity of binary search?",
      "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      "selected_answer": "O(log n)",
      "correct_answer": "O(log n)",
      "is_correct": true,
      "explanation": "Binary search divides the search space in half with each iteration, resulting in O(log n) time complexity."
    },
    {
      "question_id": 102,
      "question_text": "Which sorting algorithm has the best average case?",
      "options": ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
      "selected_answer": "Quick Sort",
      "correct_answer": "Quick Sort",
      "is_correct": true,
      "explanation": "Quick Sort has an average time complexity of O(n log n) and is generally the fastest comparison-based sorting algorithm."
    },
    {
      "question_id": 103,
      "question_text": "...",
      "options": [...],
      "selected_answer": "Option A",
      "correct_answer": "Option D",
      "is_correct": false,
      "explanation": "The correct answer is Option D because..."
    },
    // ... 7 more answers
  ],
  "message": "Quiz completed successfully"
}
```

#### Step 🔟: Frontend Displays Results

**Frontend shows:**
- ✅ 80% Score in big numbers
- ✅ 8/10 Correct answers
- ✅ Each answer reviewed with explanations
- ✅ Green highlight for correct answers
- ✅ Red highlight for incorrect answers
- ✅ Option to retry quiz

---

## 🎯 Complete cURL Examples

### Example 1: Get Available Companies

```bash
curl -X GET http://localhost:8000/api/company-quiz/companies \
  -H "Content-Type: application/json"
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "TCS",
    "description": "TCS placement exams",
    "created_at": "2026-01-22T10:00:00"
  },
  {
    "id": 2,
    "name": "Infosys",
    "description": "Infosys placement tests",
    "created_at": "2026-01-22T10:05:00"
  }
]
```

### Example 2: Start TCS Medium Quiz

```bash
curl -X POST http://localhost:8000/api/company-quiz/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token_here" \
  -d '{
    "company": "TCS",
    "level": "medium",
    "count": 5,
    "topic": "Aptitude"
  }'
```

**Response:**
```json
{
  "session_id": 1,
  "company": "TCS",
  "level": "medium",
  "total_questions": 5,
  "started_at": "2026-01-22T14:30:00",
  "questions": [
    {
      "id": 1,
      "question_text": "A man covers a distance of 50 km in 5 hours. His speed is?",
      "options": ["10 km/h", "20 km/h", "30 km/h", "40 km/h"]
    },
    {
      "id": 2,
      "question_text": "The average of first 50 natural numbers is?",
      "options": ["25", "25.5", "26", "50"]
    },
    {
      "id": 3,
      "question_text": "If A:B = 3:5 and B:C = 5:7, then A:C = ?",
      "options": ["3:5", "3:7", "3:15", "15:35"]
    },
    {
      "id": 4,
      "question_text": "A can do a work in 15 days and B can do it in 20 days. In how many days can both do it together?",
      "options": ["6", "7", "8", "35/7"]
    },
    {
      "id": 5,
      "question_text": "What is the next number in series: 2, 6, 12, 20, 30, ?",
      "options": ["40", "42", "45", "50"]
    }
  ],
  "message": "Quiz started successfully"
}
```

### Example 3: Submit Quiz Answers

```bash
curl -X POST http://localhost:8000/api/company-quiz/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token_here" \
  -d '{
    "session_id": 1,
    "answers": [
      {
        "question_id": 1,
        "selected_answer": "10 km/h"
      },
      {
        "question_id": 2,
        "selected_answer": "25.5"
      },
      {
        "question_id": 3,
        "selected_answer": "3:7"
      },
      {
        "question_id": 4,
        "selected_answer": "35/7"
      },
      {
        "question_id": 5,
        "selected_answer": "42"
      }
    ]
  }'
```

**Response:**
```json
{
  "session_id": 1,
  "company": "TCS",
  "level": "medium",
  "score": 5,
  "total": 5,
  "percentage": 100.0,
  "status": "completed",
  "completed_at": "2026-01-22T14:40:00",
  "answers": [
    {
      "question_id": 1,
      "question_text": "A man covers a distance of 50 km in 5 hours. His speed is?",
      "options": ["10 km/h", "20 km/h", "30 km/h", "40 km/h"],
      "selected_answer": "10 km/h",
      "correct_answer": "10 km/h",
      "is_correct": true,
      "explanation": "Speed = Distance/Time = 50/5 = 10 km/h"
    },
    {
      "question_id": 2,
      "question_text": "The average of first 50 natural numbers is?",
      "options": ["25", "25.5", "26", "50"],
      "selected_answer": "25.5",
      "correct_answer": "25.5",
      "is_correct": true,
      "explanation": "Average of first n natural numbers = (n+1)/2 = (50+1)/2 = 25.5"
    },
    {
      "question_id": 3,
      "question_text": "If A:B = 3:5 and B:C = 5:7, then A:C = ?",
      "options": ["3:5", "3:7", "3:15", "15:35"],
      "selected_answer": "3:7",
      "correct_answer": "3:7",
      "is_correct": true,
      "explanation": "A:C = (A:B) × (B:C) = 3:5 × 5:7 = 3:7"
    },
    {
      "question_id": 4,
      "question_text": "A can do a work in 15 days and B can do it in 20 days. In how many days can both do it together?",
      "options": ["6", "7", "8", "35/7"],
      "selected_answer": "35/7",
      "correct_answer": "35/7",
      "is_correct": true,
      "explanation": "A's work per day = 1/15, B's work per day = 1/20. Combined = 1/15 + 1/20 = 7/60. Time = 60/7 ≈ 8.57 days = 35/7 days"
    },
    {
      "question_id": 5,
      "question_text": "What is the next number in series: 2, 6, 12, 20, 30, ?",
      "options": ["40", "42", "45", "50"],
      "selected_answer": "42",
      "correct_answer": "42",
      "is_correct": true,
      "explanation": "Pattern: 2=1×2, 6=2×3, 12=3×4, 20=4×5, 30=5×6, 42=6×7"
    }
  ],
  "message": "Quiz completed successfully"
}
```

### Example 4: Get Quiz History

```bash
curl -X GET http://localhost:8000/api/company-quiz/history \
  -H "Authorization: Bearer your_jwt_token_here"
```

**Response:**
```json
[
  {
    "id": 1,
    "company": "TCS",
    "level": "medium",
    "score": 5,
    "total_questions": 5,
    "percentage": 100.0,
    "status": "completed",
    "started_at": "2026-01-22T14:30:00",
    "completed_at": "2026-01-22T14:40:00"
  },
  {
    "id": 2,
    "company": "TCS",
    "level": "easy",
    "score": 8,
    "total_questions": 10,
    "percentage": 80.0,
    "status": "completed",
    "started_at": "2026-01-22T13:00:00",
    "completed_at": "2026-01-22T13:15:00"
  }
]
```

---

## 🎯 Key Performance Metrics

### Cold Start (First Request for TCS + Easy)
```
User clicks Start → 
  Gemini API called → 
  Questions generated → 
  Stored in DB → 
  Returned to user
  
Total time: 5-10 seconds
```

### Warm Start (Subsequent Requests)
```
User clicks Start → 
  DB query (10 questions) → 
  Returned to user
  
Total time: 100-200ms
```

### Cost Per Question
```
Gemini API: Free tier ~$0
Backend processing: <$0.0001
Database storage: <$0.0001
Total per 10 questions: ~$0.001
```

---

**Now you have the complete flow! Ready to implement! 🚀**
