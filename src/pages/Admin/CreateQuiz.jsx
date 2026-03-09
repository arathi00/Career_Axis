import React, { useState } from "react";
import "../../styles/AdminDashboard.css";
import { createQuiz } from "../../api/adminQuizApi";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz() {

  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quizData = {
      title: quizTitle,
      domain,
      difficulty,
      time_limit: Number(timeLimit),
      description
    };

    try {

      await createQuiz(quizData);

      alert("Quiz Created Successfully 🎉");

      // reset form
      setQuizTitle("");
      setDomain("");
      setDifficulty("");
      setDescription("");
      setTimeLimit("");

      // go back to assessments page
      navigate("/admin/manage-assessments");

    } catch (err) {
      console.error("Quiz creation failed:", err);
      alert("Failed to create quiz");
    }
  };

  return (
    <div className="admin-container">

      <h2>Create New Quiz</h2>

      <form className="quiz-form" onSubmit={handleSubmit}>

        {/* Quiz Title */}
        <label>Quiz Title</label>
        <input
          type="text"
          placeholder="Example: Java Fundamentals"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          required
        />

        {/* Domain */}
        <label>Domain</label>
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        >
          <option value="">Select Domain</option>
          <option value="Programming">Programming</option>
          <option value="Aptitude">Aptitude</option>
          <option value="Database">Database</option>
          <option value="Computer Networks">Computer Networks</option>
        </select>

        {/* Difficulty */}
        <label>Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          required
        >
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Time Limit */}
        <label>Time Limit (minutes)</label>
        <input
          type="number"
          placeholder="Example: 30"
          value={timeLimit}
          min="1"
          onChange={(e) => setTimeLimit(e.target.value)}
          required
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          placeholder="Quiz description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" className="create-btn">
          Create Quiz
        </button>

      </form>

    </div>
  );
}