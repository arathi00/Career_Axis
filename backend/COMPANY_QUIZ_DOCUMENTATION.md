# 🎯 Company-Specific Quiz System with Gemini API Integration

Complete implementation of a company-specific placement test system that dynamically generates questions using Google's Gemini API.

## 📋 Architecture Overview

```
Frontend (React)
      ↓
  POST /api/company-quiz/start
      ↓
Backend (FastAPI)
      ↓
  [Check DB for existing questions]
      ↓
  [If not enough] → Call Gemini API
      ↓
  [Store in Database]
      ↓
  Return Questions to Frontend
      ↓
Frontend displays Quiz
      ↓
  POST /api/company-quiz/submit
      ↓
Backend calculates score & returns results
```

## 🗄️ Database Schema

### Tables Created

```sql
1. companies
   - id (PK)
   - name (TCS, Infosys, Wipro, etc.)
   - description
   - created_at

2. quiz_levels
   - id (PK)
   - company_id (FK)
   - level (EASY | MEDIUM | HARD)
   - created_at

3. company_questions
   - id (PK)
   - company_id (FK)
   - level_id (FK)
   - question_text
   - options (JSON array)
   - correct_answer
   - explanation
   - source (gemini, manual)
   - created_at

4. quiz_sessions
   - id (PK)
   - company_id (FK)
   - level_id (FK)
   - user_id (FK, nullable for guests)
   - started_at
   - completed_at
   - score
   - total_questions
   - status (active, completed, abandoned)

5. session_answers
   - id (PK)
   - session_id (FK)
   - question_id (FK)
   - selected_answer
   - is_correct (1/0)
   - answered_at
```

## 🔧 Setup Instructions

### 1. Update Requirements

```bash
cd backend
pip install -r requirements.txt
```

The following new packages are added:
- `google-generativeai==0.8.3` - Gemini API client
- `alembic==1.13.1` - Database migrations

### 2. Configure Environment Variables

Update `.env` file:

```env
DATABASE_URL=postgresql://postgres:root123@localhost:5432/career_axis
SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=AIzaSyBTl-l4VCaKndt_qAgCHADwrDouMh9KzYA # ← NEW: Get from Google AI Studio
```

**How to get Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy and paste into `.env`

### 3. Run Database Migration

```bash
# Create migration
alembic upgrade head

# Or manually create tables
python -m app.database.base
```

### 4. Start Backend

```bash
cd backend
uvicorn main:app --reload
```

## 🚀 API Endpoints

### 1. Start Quiz (Main Endpoint)

**Endpoint:** `POST /api/company-quiz/start`

**Request:**
```json
{
  "company": "TCS",
  "level": "easy",
  "count": 10,
  "topic": "Aptitude"
}
```

**Response:**
```json
{
  "session_id": 1,
  "company": "TCS",
  "level": "easy",
  "total_questions": 10,
  "started_at": "2026-01-22T10:30:00",
  "questions": [
    {
      "id": 1,
      "question_text": "What is the time complexity of binary search?",
      "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"]
    }
  ],
  "message": "Quiz started successfully"
}
```

**What Happens Behind Scenes:**
1. ✅ Validates company exists (creates if not)
2. ✅ Gets/creates quiz level for difficulty
3. ✅ Checks DB for existing questions
4. ✅ If not enough questions → **Calls Gemini API**
5. ✅ Stores generated questions in DB
6. ✅ Creates quiz session
7. ✅ Returns questions (without answers)

### 2. Submit Quiz

**Endpoint:** `POST /api/company-quiz/submit`

**Request:**
```json
{
  "session_id": 1,
  "answers": [
    {
      "question_id": 1,
      "selected_answer": "O(log n)"
    },
    {
      "question_id": 2,
      "selected_answer": "Option B"
    }
  ]
}
```

**Response:**
```json
{
  "session_id": 1,
  "company": "TCS",
  "level": "easy",
  "score": 8,
  "total": 10,
  "percentage": 80.0,
  "status": "completed",
  "completed_at": "2026-01-22T10:45:00",
  "answers": [
    {
      "question_id": 1,
      "question_text": "What is the time complexity of binary search?",
      "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      "selected_answer": "O(log n)",
      "correct_answer": "O(log n)",
      "is_correct": true,
      "explanation": "Binary search divides the search space in half each time, resulting in O(log n) complexity."
    }
  ],
  "message": "Quiz completed successfully"
}
```

### 3. Get Quiz History

**Endpoint:** `GET /api/company-quiz/history`

**Response:**
```json
[
  {
    "id": 1,
    "company": "TCS",
    "level": "easy",
    "score": 8,
    "total_questions": 10,
    "percentage": 80.0,
    "status": "completed",
    "started_at": "2026-01-22T10:30:00",
    "completed_at": "2026-01-22T10:45:00"
  }
]
```

### 4. Get Companies

**Endpoint:** `GET /api/company-quiz/companies`

**Response:**
```json
[
  {
    "id": 1,
    "name": "TCS",
    "description": "TCS placement exams",
    "created_at": "2026-01-22T10:00:00"
  }
]
```

### 5. Create Company (Admin)

**Endpoint:** `POST /api/company-quiz/companies`

**Request:**
```json
{
  "name": "Infosys",
  "description": "Infosys placement tests"
}
```

## 🤖 Gemini API Integration

### How It Works

1. **User clicks "Start Quiz"** with TCS + Easy difficulty
2. **Backend checks**: Does TCS + Easy have enough questions in DB?
3. **If YES**: Return cached questions (faster, no API cost)
4. **If NO**: 
   - Build prompt with company/difficulty/topic
   - Call Gemini API
   - Parse JSON response
   - Validate question structure
   - Store in DB with `source: "gemini"`
   - Return questions

### Prompt Template

```
You are an expert question setter for TCS placement exams with 20+ years experience.

Generate EXACTLY 10 easy-level multiple-choice questions for TCS placement test.

**Requirements:**
- Topic: Aptitude
- Difficulty Level: easy (basic concepts, simple calculations, fundamental knowledge)
- Company: TCS
- Each question must have EXACTLY 4 options
- Only ONE correct answer per question
- Include brief explanation for each answer

**Output Format (STRICT JSON):**
[
  {
    "question_text": "...",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "...",
    "explanation": "..."
  }
]
```

### Question Validation

Generated questions are validated for:
- ✅ Required fields present
- ✅ Exactly 4 options
- ✅ Correct answer in options
- ✅ Valid JSON format
- ✅ No duplicates

## 💻 Frontend Integration

### Using the API Hook

```javascript
import { useQuizStart } from '../api/companyQuizApi';

function MyComponent() {
  const { quiz, loading, error, startNewQuiz } = useQuizStart();
  
  const handleStart = async () => {
    try {
      const quizData = await startNewQuiz('TCS', 'easy', 10);
      console.log('Quiz started:', quizData);
    } catch (err) {
      console.error('Error:', err);
    }
  };
  
  return (
    <button onClick={handleStart} disabled={loading}>
      {loading ? 'Starting...' : 'Start Quiz'}
    </button>
  );
}
```

### Full Component Example

See `src/components/CompanyQuiz.jsx` for complete implementation with:
- Company & difficulty selection
- Quiz display with timer
- Navigation between questions
- Answer tracking
- Results with detailed explanations

## 📊 Performance Optimization

### Caching Strategy

```
First User (TCS + Easy):
  - No questions in DB
  - Call Gemini API (~5-10 seconds)
  - Store 10 questions in DB
  - Return to user

Second User (Same settings):
  - 10 questions already in DB
  - Return immediately (~100ms)
  - No API cost
  - No delay
```

### Limits & Quotas

- Gemini API: Free tier includes 60 requests/minute
- Generate questions proactively:
  - For popular companies/levels
  - During off-peak hours
  - Batch generate if needed

## 🧪 Testing

### Manual Test Flow

1. **Start Backend**
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

2. **Create Company**
   ```bash
   curl -X POST http://localhost:8000/api/company-quiz/companies \
     -H "Content-Type: application/json" \
     -d '{"name": "TCS", "description": "TCS Placement Exams"}'
   ```

3. **Start Quiz**
   ```bash
   curl -X POST http://localhost:8000/api/company-quiz/start \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "company": "TCS",
       "level": "easy",
       "count": 5
     }'
   ```

4. **Submit Answers**
   ```bash
   curl -X POST http://localhost:8000/api/company-quiz/submit \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "session_id": 1,
       "answers": [
         {"question_id": 1, "selected_answer": "Option A"},
         {"question_id": 2, "selected_answer": "Option B"}
       ]
     }'
   ```

## 🔒 Security Considerations

1. **Authentication**: All endpoints require JWT token (except get companies)
2. **Authorization**: Users can only see their own quiz history
3. **API Keys**: Store Gemini API key in `.env`, never commit to git
4. **Rate Limiting**: Implement rate limiting on Gemini API calls
5. **Input Validation**: All inputs validated with Pydantic schemas

## 📈 Future Enhancements

1. **Analytics Dashboard**
   - Score trends per company/difficulty
   - Time spent per question
   - Popular topics/weak areas

2. **Adaptive Difficulty**
   - Adjust difficulty based on performance
   - Skip easy questions for high performers

3. **Multiple Question Types**
   - Multiple choice (current)
   - True/False
   - Fill in the blank
   - Coding challenges

4. **Admin Panel**
   - Manual question creation
   - Approve/reject AI-generated questions
   - View analytics per company
   - Manage companies and levels

5. **Batch Question Generation**
   - Generate 100+ questions at once
   - Schedule off-peak generation
   - Bulk import from CSV

## 📞 Support

For issues or questions:
1. Check the API documentation
2. Review Gemini API documentation: https://ai.google.dev/
3. Check logs in backend console
4. Verify `.env` configuration

---

**Made with ❤️ for placement preparation**
