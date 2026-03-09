import React, { useState } from "react";
import { generateAIQuestions } from "../../api/adminQuizApi";
import "../../styles/ManageAssessments.css";

export default function GenerateQuestionsModal({ onClose }) {

  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [count, setCount] = useState(5);

  const handleGenerate = async () => {
    try {

      const data = {
        domain,
        difficulty,
        count
      };

      await generateAIQuestions(data);

      alert("AI Questions Generated Successfully");

      onClose();

    } catch (error) {
      console.error("Error generating questions:", error);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h3>Generate AI Questions</h3>

        <label>Domain</label>
        <select onChange={(e) => setDomain(e.target.value)}>
          <option value="">Select Domain</option>
          <option value="Programming">Programming</option>
          <option value="Aptitude">Aptitude</option>
          <option value="Database">Database</option>
        </select>

        <label>Difficulty</label>
        <select onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <label>No. of Questions</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />

        <button onClick={handleGenerate}>
          Generate
        </button>

        <button onClick={onClose}>
          Cancel
        </button>

      </div>

    </div>
  );
}