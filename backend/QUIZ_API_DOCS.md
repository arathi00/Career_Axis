# Quiz System API Documentation

## Overview
Complete quiz generation, evaluation, and result tracking system with AI integration and company-specific question banks.

---

## 📋 Endpoints

### 1️⃣ Companies & Categories

#### Get Available Companies
```
GET /quizzes/companies
```
**Response:**
```json
{
  "TCS": ["Software Engineer"],
  "Infosys": ["Software Engineer"],
  "Wipro": ["Software Engineer"],
  "Bosch": ["Mechanical Engineer"],
  "L&T": ["Mechanical Engineer"],
  "Siemens": ["Electrical Engineer"],
  ...
}
```

#### Get Categories for Company
```
GET /quizzes/companies/{company}/tracks/{track}/categories
```

**Parameters:**
- `company`: TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, HCL, Tech Mahindra, Bosch, L&T, Siemens
- `track`: Software Engineer, Mechanical Engineer, Electrical Engineer (varies by company)

**Example Response:**
```json
{
  "Technical": [
    {
      "category": "Arrays",
      "topics": ["Basic Operations", "Advanced Algorithms"],
      "total_questions": 15
    },
    {
      "category": "DBMS",
      "topics": ["Normalization", "Queries"],
      "total_questions": 25
    }
  ],
  "Aptitude": [
    {
      "category": "Aptitude",
      "topics": ["Time & Work", "Percentages"],
      "total_questions": 30
    }
  ]
}
```

---

### 2️⃣ Quiz Generation & Taking

#### Generate Quiz (AI-Generated)
```
POST /quizzes/ai-generate
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "company": "TCS",
  "track": "Software Engineer",
  "exam_type": "Technical",
  "category": "Arrays",
  "topic": "Basic Operations",
  "difficulty": "Medium",
  "question_type": "MCQ",
  "count": 5
}
```

**Response (Quiz Created - No Answers Shown):**
```json
{
  "quiz_id": 42,
  "company": "TCS",
  "track": "Software Engineer",
  "topic": "Basic Operations",
  "difficulty": "Medium",
  "question_type": "MCQ",
  "question_count": 5,
  "questions": [
    {
      "question_id": 101,
      "question": "What is the time complexity of accessing an array element?",
      "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"]
    },
    {
      "question_id": 102,
      "question": "Which sorting algorithm is fastest in average case?",
      "options": ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"]
    }
    // ... more questions
  ]
}
```

#### Fetch Quiz (For Taking)
```
GET /quizzes/{quiz_id}
```

**Response (Same as above - no correct answers):**
```json
{
  "quiz_id": 42,
  "company": "TCS",
  "track": "Software Engineer",
  "topic": "Basic Operations",
  "difficulty": "Medium",
  "question_type": "MCQ",
  "question_count": 5,
  "questions": [...]
}
```

---

### 3️⃣ Quiz Submission & Evaluation

#### Submit Quiz Answers
```
POST /quizzes/{quiz_id}/submit
```

**Request Body:**
```json
{
  "quiz_id": 42,
  "answers": [
    {
      "question_id": 101,
      "selected_answer": "O(1)"
    },
    {
      "question_id": 102,
      "selected_answer": "Quick Sort"
    }
    // ... all answers
  ]
}
```

**Response (Results with Correct Answers):**
```json
{
  "quiz_id": 42,
  "score": 4,
  "total": 5,
  "percentage": 80,
  "questions": [
    {
      "question_id": 101,
      "question": "What is the time complexity of accessing an array element?",
      "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      "correct_answer": "O(1)",
      "explanation": "Array indexing is constant time due to direct memory addressing."
    },
    {
      "question_id": 102,
      "question": "Which sorting algorithm is fastest in average case?",
      "options": ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
      "correct_answer": "Quick Sort",
      "explanation": "QuickSort averages O(n log n) compared to others' O(n²)"
    }
    // ... all questions with explanations
  ]
}
```

---

### 4️⃣ Results & History

#### Get Quiz Result
```
GET /quizzes/{quiz_id}/result/{result_id}
```

**Response:**
```json
{
  "quiz_id": 42,
  "result_id": 7,
  "score": 4,
  "total": 5,
  "percentage": 80,
  "submitted_at": "2024-01-21T10:30:45",
  "questions": [
    {
      "question_id": 101,
      "question": "What is the time complexity of accessing an array element?",
      "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      "correct_answer": "O(1)",
      "explanation": "Array indexing is constant time."
    }
    // ... all questions
  ]
}
```

#### List Quizzes
```
GET /quizzes?company=TCS&track=Software+Engineer&skip=0&limit=50
```

**Response:**
```json
[
  {
    "id": 42,
    "company": "TCS",
    "track": "Software Engineer",
    "topic": "Basic Operations",
    "difficulty": "Medium",
    "question_count": 5,
    "created_at": "2024-01-21T09:00:00"
  },
  // ... more quizzes
]
```

---

## 🔐 Security

### Access Control
- **Quiz Generation**: Admin only (`Authorization: Bearer {admin_token}`)
- **Quiz Taking**: All users (public)
- **Result Viewing**: Public (can implement user-specific restrictions later)

### Data Protection
- ✅ Correct answers **NEVER** exposed during quiz play
- ✅ Answers revealed only **AFTER** submission
- ✅ All results persisted in database
- ✅ Source tracking (AI vs Fallback)

---

## 📊 Supported Companies & Tracks

### Software/IT
- **TCS**: 110 questions (Arrays, Strings, DBMS, OOPS, Aptitude)
- **Infosys**: 105 questions (OOPS, SQL, Data Structures, Logical, Pseudocode)
- **Wipro**: 105 questions (C, Java, Arrays/Strings, Aptitude, HR)
- **Accenture**: 115 questions (C/C++, OOPS/Java, DBMS, Logical, HR)
- **Cognizant**: 110 questions (Java/Python, Data Structures, SQL, Aptitude, Scenario)
- **Capgemini**: 115 questions (PseudoCode, C, Cloud, Aptitude, HR)
- **HCL**: 115 questions (C/C++, OOPS, OS, SQL, HR)
- **Tech Mahindra**: 115 questions (Java, Web Tech, SQL, Aptitude, HR)

### Core/Mechanical
- **Bosch**: 120 questions (Thermodynamics, Materials, Manufacturing, Fluid, Aptitude)
- **L&T**: 110 questions (Thermodynamics, Materials, Fluid, Mechanics, Aptitude)
- **Siemens**: 115 questions (Mechanics, Control Systems, Thermal, Automation, Aptitude)

---

## 🚀 Difficulty Levels
- `Easy`: Basic concepts, straightforward questions
- `Medium`: Mixed conceptual and application-based
- `Hard`: Complex scenarios, edge cases, competitive level

---

## 📝 Question Types
- `MCQ`: Multiple Choice Question (4 options)
- `Technical`: Code/Logic based
- `Aptitude`: Numerical/Logical reasoning
- `Scenario`: Situational/Behavioral

---

## 🔄 Data Flow

1. **Generate Quiz**
   - Admin requests quiz via API
   - System calls OpenAI (or fallback)
   - AI generates validated JSON
   - Questions stored in DB with `correct_answer` hidden

2. **Take Quiz**
   - User fetches quiz (sees questions + options ONLY)
   - User submits answers

3. **Evaluate**
   - Backend compares submitted answers with DB `correct_answer`
   - Score calculated
   - Result returned with correct answers + explanations

4. **History**
   - Result stored in `quiz_results` table
   - User can view past results anytime

---

## ✅ Quality Assurance

### Validation
- ✅ Exactly 4 options per question
- ✅ Correct answer is in options list
- ✅ No duplicate options
- ✅ All metadata fields validated

### Fallback System
- ✅ If AI fails → Uses real curated seed data
- ✅ No quiz generation failures
- ✅ Source tracking (`"source": "AI"` or `"source": "Fallback"`)

### Logging
- ✅ AI response validation logged
- ✅ Generation errors captured
- ✅ Fallback activation tracked

---

## 🛠️ Configuration

### Database Models
- `Quiz`: Stores quiz metadata
- `Question`: Stores questions (linked to Quiz)
- `QuizResult`: Stores submission results
- `UserAnswer`: (Optional) Tracks individual answers

### Environment Variables
```env
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://user:pass@localhost/career_axis
```

---

## 📌 Example Workflow

### 1. Get Companies
```bash
curl http://localhost:8000/quizzes/companies
```

### 2. Get Categories
```bash
curl http://localhost:8000/quizzes/companies/TCS/tracks/Software%20Engineer/categories
```

### 3. Generate Quiz
```bash
curl -X POST http://localhost:8000/quizzes/ai-generate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "TCS",
    "track": "Software Engineer",
    "exam_type": "Technical",
    "category": "Arrays",
    "topic": "Basic Operations",
    "difficulty": "Medium",
    "question_type": "MCQ",
    "count": 5
  }'
```

### 4. Take Quiz (Fetch)
```bash
curl http://localhost:8000/quizzes/42
```

### 5. Submit Answers
```bash
curl -X POST http://localhost:8000/quizzes/42/submit \
  -H "Content-Type: application/json" \
  -d '{
    "quiz_id": 42,
    "answers": [
      {"question_id": 101, "selected_answer": "O(1)"},
      {"question_id": 102, "selected_answer": "Quick Sort"}
    ]
  }'
```

### 6. Get Result
```bash
curl http://localhost:8000/quizzes/42/result/7
```

---

## 🐛 Troubleshooting

### Quiz Generation Failed
- Check OpenAI API key configuration
- Check network connectivity
- Fallback data will be used automatically

### Answers Not Matching
- Verify exact string match (case-sensitive)
- Check for extra spaces in options

### Database Errors
- Ensure Alembic migration ran: `alembic upgrade head`
- Check foreign key constraints

---

## 🎯 Future Enhancements
- Timed quizzes
- Difficulty adaptive questions
- Question analytics & reporting
- Custom company question sets
- Negative marking
- Randomized options order
- API rate limiting
