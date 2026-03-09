import React, { useState, useEffect } from "react";
import { getQuizQuestions } from "../../api/adminQuizApi";
import { approveQuestion, rejectQuestion } from "../../api/adminQuizApi";

export default function ViewQuestionModal({ quiz, onClose }) {

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (quiz?.id) {
      fetchQuestions();
    }
  }, [quiz]);

  const fetchQuestions = async () => {
    try {
      const data = await getQuizQuestions(quiz.id);
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h3>{quiz.title} - Questions</h3>

        <table className="admin-table">

          <thead>
            <tr>
              <th>Question</th>
              <th>Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {questions.length > 0 ? (
              questions.map((q) => (
                <tr key={q.id}>

                  <td>{q.question_text}</td>
                  <td>{q.source}</td>
                  <td>{q.status}</td>

                  <td>
                    <button
  onClick={async () => {
    await approveQuestion(q.id);
    fetchQuestions();
  }}
>
  ✅ Approve
</button>

<button
  onClick={async () => {
    await rejectQuestion(q.id);
    fetchQuestions();
  }}
>
  ❌ Reject
</button>
                
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No questions found</td>
              </tr>
            )}

          </tbody>

        </table>

        <button onClick={onClose} className="close-btn">
          Close
        </button>

      </div>

    </div>
  );
}