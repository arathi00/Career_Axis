import React, { useEffect, useState, useRef } from "react";
import { submitFeedback } from "../../api/interviewApi";

/*
  InterviewWindow is a UI placeholder for video/chat.
  Replace the video area with your preferred SDK (Agora/Jitsi/Mediasoup).
  Props:
    interviewId - id of the interview session
    role - "student" | "trainer"
*/

const InterviewWindow = ({ interviewId, role = "student", onEnd }) => {
  const [interview, setInterview] = useState(null);

  // Chat state
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const chatRef = useRef(null);

  // 🔹 Trainer feedback state
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!interviewId) return;

    // Note: getInterview is not exported from interviewApi
    // For now, we'll skip fetching the interview data
    // setInterview(data)
  }, [interviewId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const m = { id: Date.now(), from: role, text: message };
    setChat((prev) => [...prev, m]);
    setMessage("");
  };

  // 🔹 Trainer submits feedback and ends interview
  const submitFeedbackAndEnd = async () => {
    if (!feedback.trim()) {
      alert("Please enter feedback before ending the interview.");
      return;
    }

    try {
      await submitFeedback(interviewId, feedback);
      alert("Feedback submitted successfully!");
      onEnd && onEnd();
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="interview-window">
      <div className="video-chat-grid">

        {/* VIDEO SECTION */}
        <div className="video-area card">
          <h4>Live Video</h4>

          <div className="video-placeholder">
            <div className="video-box">
              [ Video stream area — integrate SDK ]
            </div>
          </div>

          <div className="controls">
            <button className="btn">Mute</button>
            <button className="btn">Camera</button>

            {/* END BUTTON (trainer submits feedback, student just exits) */}
            {role === "trainer" ? (
              <button
                className="btn btn-danger"
                onClick={submitFeedbackAndEnd}
              >
                End Interview
              </button>
            ) : (
              <button
                className="btn btn-danger"
                onClick={() => onEnd && onEnd()}
              >
                Leave Interview
              </button>
            )}
          </div>
        </div>

        {/* QUESTIONS + CHAT */}
        <div className="question-chat card">

          {/* QUESTIONS PANEL */}
          <div className="question-panel">
            <h4>Interviewer Notes / Questions</h4>
            <p>
              {interview?.notes || "Trainer will display questions here."}
            </p>
          </div>

          {/* CHAT PANEL */}
          <div className="chat-panel">
            <h5>Chat</h5>

            <div className="chat-log" ref={chatRef}>
              {chat.map((m) => (
                <div key={m.id} className={`chat-msg ${m.from}`}>
                  <strong>{m.from}: </strong>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
              />
              <button onClick={sendMessage} className="btn">
                Send
              </button>
            </div>
          </div>

          {/* 🔹 TRAINER FEEDBACK PANEL */}
          {role === "trainer" && (
            <div className="feedback-panel">
              <h4>Interview Feedback</h4>
              <textarea
                placeholder="Enter feedback for the student..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewWindow;
