import React, { useState } from "react";
import { addQuestion } from "../../api/adminQuizApi";
import "../../styles/AdminDashboard.css";
export default function AddQuestionModal({ quiz, onClose }) {

  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  const questionData = {
    quiz_id: quiz.id,
    question_text: question,
    option_a: optionA,
    option_b: optionB,
    option_c: optionC,
    option_d: optionD,
    correct_answer: correctAnswer
  };

  await addQuestion(questionData);

  alert("Question Added");
  onClose();
};

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h3>Add Question - {quiz.title}</h3>

        <form onSubmit={handleSubmit} className="question-form">

          <textarea
            placeholder="Enter Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Option A"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Option B"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Option C"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Option D"
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Correct Answer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          />

          <button type="submit">
            Add Question
          </button>

        </form>

        <button onClick={onClose} className="close-btn">
          Cancel
        </button>

      </div>

    </div>
  );
}