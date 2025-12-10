// src/components/UI/InterviewWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import interviewApi from "../../api/interviewApi";

/*
  InterviewWindow is a UI placeholder for video/chat.
  Replace the video area with your preferred SDK (Agora/Jitsi/Mediasoup).
  Props:
    interviewId - id of the interview session
    role - "student" | "trainer"
*/
const InterviewWindow = ({ interviewId, role = "student", onEnd }) => {
  const [interview, setInterview] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const chatRef = useRef();

  useEffect(() => {
    // fetch interview metadata (optional)
    if (!interviewId) return;
    interviewApi.getInterview(interviewId).then(setInterview).catch(console.error);
  }, [interviewId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const m = { id: Date.now(), from: role, text: message };
    setChat(prev => [...prev, m]);
    setMessage("");
    // optionally save chat to server via API
  };

  return (
    <div className="interview-window">
      <div className="video-chat-grid">
        <div className="video-area card">
          <h4>Live Video</h4>
          <div className="video-placeholder">
            {/* Replace this with your video SDK component (local & remote video elements) */}
            <div className="video-box">[ Video stream area — integrate SDK ]</div>
          </div>
          <div className="controls">
            <button className="btn">Mute</button>
            <button className="btn">Camera</button>
            <button className="btn btn-danger" onClick={() => onEnd && onEnd()}>
              End Interview
            </button>
          </div>
        </div>

        <div className="question-chat card">
          <div className="question-panel">
            <h4>Interviewer Notes / Questions</h4>
            <p>{interview?.questions || "Trainer will display questions here."}</p>
          </div>

          <div className="chat-panel">
            <h5>Chat</h5>
            <div className="chat-log" ref={chatRef}>
              {chat.map(m => (
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
              <button onClick={sendMessage} className="btn">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewWindow;
