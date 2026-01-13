import React, { useState, useEffect, useMemo } from "react";
import "@/styles/QuizStyles.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function QuizList() {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const trackFilter = params.get("track");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    import("@/api/quizApi")
      .then(({ fetchQuizzes }) => {
        fetchQuizzes()
          .then((data) => {
            if (mounted) setTopics(data);
          })
          .catch((err) => {
            if (mounted) setError(err.message || "Failed to load quizzes");
          })
          .finally(() => {
            if (mounted) setLoading(false);
          });
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Failed to import API");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="quiz-page">
      <h1 className="quiz-title">Practice Quizzes</h1>
      <p className="quiz-subtitle">Choose a topic and test your skills</p>

      {loading ? (
        <p>Loading quizzes...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        (() => {
          const filtered = trackFilter
            ? topics.filter((t) => {
                const tk = trackFilter.toLowerCase();
                if (t.track && String(t.track).toLowerCase() === tk) return true;
                if (t.category && String(t.category).toLowerCase() === tk) return true;
                if (t.title && String(t.title).toLowerCase().includes(tk)) return true;
                if (Array.isArray(t.tags) && t.tags.some((tag) => String(tag).toLowerCase().includes(tk))) return true;
                return false;
              })
            : topics;

          if (filtered.length === 0) {
            return <p>No quizzes found for "{trackFilter}".</p>;
          }

          // Group by track/category when not filtered
          if (!trackFilter) {
            const groups = filtered.reduce((acc, t) => {
              const key = t.track || t.category || "General";
              if (!acc[key]) acc[key] = [];
              acc[key].push(t);
              return acc;
            }, {});

            return (
              <div>
                {Object.keys(groups).map((key) => (
                  <section key={key} style={{ marginBottom: 24 }}>
                    <h3 className="group-title">{key}</h3>
                    <div className="topics-grid">
                      {groups[key].map((t) => (
                        <div className="topic-card" key={t.id}>
                          <h3>{t.title}</h3>
                          <p>{t.desc || "Practice topic"}</p>

                          <div className="topic-meta">
                            {t.duration && <span className="meta-badge">⏱ {t.duration} mins</span>}
                            {t.level && <span className="meta-badge">⭐ {t.level}</span>}
                            <span className="topic-badge">{t.questions} questions</span>
                          </div>

                          <div className="topic-actions">
                            <button
                              className="start-btn"
                              onClick={() => navigate(`/student/quiz/${t.id}`)}
                            >
                              Start Quiz
                            </button>

                            <button
                              className="secondary-btn"
                              onClick={() => navigate(`/student/quiz/review`, { state: { quizId: t.id } })}
                            >
                              Review
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            );
          }

          return (
            <div className="topics-grid">
              {filtered.map((t) => (
                <div className="topic-card" key={t.id}>
                  <h3>{t.title}</h3>
                  <p>{t.desc || "Practice topic"}</p>

                  <div className="topic-meta">
                    {t.duration && <span className="meta-badge">⏱ {t.duration} mins</span>}
                    {t.level && <span className="meta-badge">⭐ {t.level}</span>}
                    <span className="topic-badge">{t.questions} questions</span>
                  </div>

                  <div className="topic-actions">
                    <button
                      className="start-btn"
                      onClick={() => navigate(`/student/quiz/${t.id}`)}
                    >
                      Start Quiz
                    </button>

                    <button
                      className="secondary-btn"
                      onClick={() => navigate(`/student/quiz/review`, { state: { quizId: t.id } })}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
}
