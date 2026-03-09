import React, { useState, useEffect } from "react";
import { getQuizzes, deleteQuiz, disableQuiz } from "../../api/adminQuizApi";
import "../../styles/ManageAssessments.css";
import GenerateQuestionsModal from "./GenerateQuestionsModal";
import ViewQuestionModal from "./ViewQuestionModal";
import AddQuestionModal from "./AddQuestionModal";
import { useNavigate } from "react-router-dom";

export default function ManageAssessments() {

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const [domainFilter, setDomainFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const [quizzes, setQuizzes] = useState([]);

  const navigate = useNavigate();

  // Fetch quizzes from backend
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    return (
      (domainFilter === "" || quiz.domain === domainFilter) &&
      (difficultyFilter === "" || quiz.difficulty === difficultyFilter)
    );
  });

  return (
    <div className="admin-container">

      <h2>Manage Assessments</h2>

      {/* Filters */}
      <div className="filters">

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
        >
          <option value="">All Domains</option>
          <option value="Programming">Programming</option>
          <option value="Aptitude">Aptitude</option>
          <option value="Database">Database</option>
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

      </div>

      {/* Create Quiz */}
      <button
        type="button"
        className="create-quiz-btn"
        onClick={() => navigate("/admin/create-quiz")}
      >
        + Create Quiz
      </button>

      {/* AI Generate Button */}
      <button
        className="ai-generate-btn"
        onClick={() => setShowGenerateModal(true)}
      >
        🤖 Generate AI Questions
      </button>

      {/* Quiz Table */}
      <table className="admin-table">

        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Domain</th>
            <th>Difficulty</th>
            <th>Total Questions</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <tr key={quiz.id}>

                <td>{quiz.title}</td>
                <td>{quiz.domain}</td>
                <td>{quiz.difficulty}</td>
                <td>{quiz.totalQuestions || "-"}</td>
                <td>{quiz.status}</td>

                <td className="actions">

                  <button
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      setShowQuestions(true);
                    }}
                  >
                    👁 View
                  </button>

                  <button
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      setShowAddQuestion(true);
                    }}
                  >
                    ➕ Add Question
                  </button>

                  <button
                    className="disable"
                    onClick={async () => {
                      try {
                        await disableQuiz(quiz.id);
                        fetchQuizzes();
                      } catch (error) {
                        console.error("Disable error:", error);
                      }
                    }}
                  >
                    ⛔ Disable
                  </button>

                  <button
                    className="delete"
                    onClick={async () => {
                      try {
                        await deleteQuiz(quiz.id);
                        fetchQuizzes();
                      } catch (error) {
                        console.error("Delete error:", error);
                      }
                    }}
                  >
                    🗑 Delete
                  </button>

                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No quizzes found</td>
            </tr>
          )}

        </tbody>

      </table>

      {/* View Questions Modal */}
      {showQuestions && (
        <ViewQuestionModal
          quiz={selectedQuiz}
          onClose={() => setShowQuestions(false)}
        />
      )}

      {/* Add Question Modal */}
      {showAddQuestion && (
        <AddQuestionModal
          quiz={selectedQuiz}
          onClose={() => setShowAddQuestion(false)}
        />
      )}

      {/* Generate Questions Modal */}
      {showGenerateModal && (
        <GenerateQuestionsModal
          onClose={() => setShowGenerateModal(false)}
        />
      )}

    </div>
  );
}