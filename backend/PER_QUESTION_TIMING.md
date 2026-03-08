# Per-Question Timing Feature

## ✅ Implementation Complete

Track the time spent on each individual question during a quiz. This allows detailed performance analysis and time management insights.

## 📊 Features

- **Per-Question Timing**: Track seconds spent on each question
- **Total Time Tracking**: Overall quiz duration in seconds  
- **Analytics Ready**: Data stored in JSON for flexible analysis

## 🔧 Database Schema

### Added to `quiz_results` table:
- `question_timings` (JSON): `{question_id: seconds_spent}` mapping

## 📝 API Usage

### Submit Quiz with Timing

```json
POST /quizzes/{quiz_id}/submit

{
  "quiz_id": 1,
  "started_at": "2026-01-26T17:00:00",
  "total_time_seconds": 1800,
  "answers": [
    {
      "question_id": 1,
      "selected_answer": "Option B",
      "time_spent": 120
    },
    {
      "question_id": 2,
      "selected_answer": "Option C",
      "time_spent": 85
    }
  ]
}
```

### Response with Timing Data

```json
{
  "quiz_id": 1,
  "score": 8,
  "total": 10,
  "percentage": 80.0,
  "started_at": "2026-01-26T17:00:00",
  "finished_at": "2026-01-26T17:30:00",
  "total_time_seconds": 1800,
  "questions": [...]
}
```

## 🎯 Frontend Integration Example

### Track Time Per Question

```javascript
// When quiz starts
const quizStartTime = new Date();
const questionTimings = {};
let currentQuestionStart = new Date();

// When moving to next question
function handleNextQuestion(questionId, selectedAnswer) {
  const timeSpent = Math.floor((new Date() - currentQuestionStart) / 1000);
  questionTimings[questionId] = timeSpent;
  
  // Start timing next question
  currentQuestionStart = new Date();
}

// On quiz submit
function submitQuiz() {
  const totalTime = Math.floor((new Date() - quizStartTime) / 1000);
  
  const answers = Object.entries(questionTimings).map(([qId, time]) => ({
    question_id: parseInt(qId),
    selected_answer: userAnswers[qId],
    time_spent: time
  }));
  
  fetch(`/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quiz_id: quizId,
      started_at: quizStartTime.toISOString(),
      total_time_seconds: totalTime,
      answers: answers
    })
  });
}
```

### React Example with Timer Display

```jsx
function QuizQuestion({ question, questionIndex, onAnswer }) {
  const [timeSpent, setTimeSpent] = useState(0);
  const startTime = useRef(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((new Date() - startTime.current) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [questionIndex]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="quiz-question">
      <div className="question-timer">
        Time: {formatTime(timeSpent)}
        {timeSpent > 120 && <span className="warning"> ⚠️ Over 2 minutes</span>}
      </div>
      <h3>{question.question}</h3>
      {/* Question options */}
    </div>
  );
}
```

## 📈 Analytics Possibilities

With per-question timing data, you can:

1. **Average Time Per Question** - Identify difficult questions
2. **Time vs Accuracy** - See if spending more time helps
3. **Student Comparison** - Compare individual timing patterns
4. **Question Optimization** - Flag questions that take too long
5. **Time Management** - Help students improve pacing

### Example Query

```python
# Get average time per question
from sqlalchemy import func
import json

results = db.query(QuizResult).all()
question_times = {}

for result in results:
    if result.question_timings:
        for q_id, time_spent in result.question_timings.items():
            if q_id not in question_times:
                question_times[q_id] = []
            question_times[q_id].append(time_spent)

# Calculate averages
for q_id, times in question_times.items():
    avg_time = sum(times) / len(times)
    print(f"Question {q_id}: {avg_time:.1f} seconds average")
```

## ⚡ Performance Tips

- **Client-side tracking**: Start timer immediately when question loads
- **Paused state**: Consider handling tab switches/window blur
- **Network latency**: Track pure question time, not API call time
- **Validation**: Optional - set max time per question (e.g., 5 minutes)

## 🎨 UI Recommendations

1. **Per-question timer**: Show countdown/count-up for each question
2. **Warning indicators**: Alert when spending >2 minutes on one question
3. **Progress bar**: Visual indicator of time remaining
4. **Results page**: Show time spent on each question in review
5. **Color coding**: Green (<60s), Yellow (60-120s), Red (>120s)

## ✨ Example Result Display

```jsx
function QuizResults({ result }) {
  return (
    <div className="quiz-results">
      <h2>Your Results</h2>
      <p>Score: {result.score}/{result.total}</p>
      <p>Total Time: {formatTime(result.total_time_seconds)}</p>
      
      <h3>Per-Question Breakdown</h3>
      {result.questions.map((q, idx) => {
        const timing = result.question_timings?.[q.question_id];
        return (
          <div key={q.question_id} className="question-result">
            <span>Q{idx + 1}</span>
            <span className={timing > 120 ? 'slow' : 'ok'}>
              {formatTime(timing)}
            </span>
            <span>{q.is_correct ? '✓' : '✗'}</span>
          </div>
        );
      })}
    </div>
  );
}
```

## 📋 Summary

✅ Database updated with `question_timings` JSON column
✅ API endpoints accept per-question timing
✅ Response includes total time and per-question data
✅ Ready for frontend implementation
✅ Analytics-ready data structure

The system now tracks:
- **Quiz start/finish times** (overall)
- **Per-question timing** (individual)
- **Total quiz duration** (calculated or client-provided)
