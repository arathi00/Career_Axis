import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "../../styles/Chatbot.css";

import { FaPaperPlane, FaTrash } from "react-icons/fa";

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! I'm PlacementCoach AI. How can I help you with your placement preparation today?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0); // 0: analyzing, 1: generating, 2: done
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);
  const loadingTimerRef = useRef(null);

  const API_BASE_URL = "http://localhost:8000/api/chatbot";

  // Handle authentication errors
  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      alert("Your session has expired. Please login again.");
      navigate("/login");
      return true;
    }
    return false;
  };

  // Get loading message based on stage
  const getLoadingMessage = () => {
    const messages = [
      "🔍 Analyzing your question...",
      "⚙️ Generating response...",
      "✨ Almost done..."
    ];
    return messages[loadingStage] || "🤖 Processing your request...";
  };

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(`${API_BASE_URL}/history?limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.items && response.data.items.length > 0) {
          const historyMessages = [];
          response.data.items.forEach((item) => {
            historyMessages.push({ sender: "user", text: item.query });
            historyMessages.push({ sender: "bot", text: item.response });
          });
          
          setMessages([
            { sender: "bot", text: "👋 Hello! I'm PlacementCoach AI. How can I help you with your placement preparation today?" },
            ...historyMessages
          ]);
        }
      } catch (err) {
        if (!handleAuthError(err)) {
          console.warn("Failed to load history:", err);
        }
      }
    };

    loadHistory();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setError("");
    const userMessage = input.trim();
    const userMsgObj = { sender: "user", text: userMessage };
    
    setMessages((prev) => [...prev, userMsgObj]);
    setInput("");
    setLoading(true);
    setLoadingStage(0);

    // Animate loading stages every 1.5 seconds
    loadingTimerRef.current = setInterval(() => {
      setLoadingStage((prev) => {
        if (prev >= 1) {
          clearInterval(loadingTimerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    try {
      const token = localStorage.getItem("access");
      
      const response = await axios.post(
        `${API_BASE_URL}/chat`,
        { message: userMessage },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const botMsgObj = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMsgObj]);

    } catch (err) {
      console.error("Chat API error:", err);
      if (!handleAuthError(err)) {
        const errorMsg = err.response?.data?.detail || "Failed to get response. Please try again.";
        setError(errorMsg);
        setMessages((prev) => [...prev, { sender: "bot", text: `⚠️ Error: ${errorMsg}` }]);
      }
    } finally {
      setLoading(false);
      setLoadingStage(0);
      clearInterval(loadingTimerRef.current);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear chat history?")) return;

    try {
      const token = localStorage.getItem("access");
      await axios.delete(`${API_BASE_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages([
        { sender: "bot", text: "👋 Hello! I'm PlacementCoach AI. How can I help you with your placement preparation today?" }
      ]);
      setError("");
    } catch (err) {
      console.error("Clear history error:", err);
      if (!handleAuthError(err)) {
        setError("Failed to clear history");
      }
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">

      <div className="chat-header">
        <span>🤖 PlacementCoach AI</span>
        <button 
          onClick={clearHistory} 
          className="clear-btn"
          title="Clear chat history"
        >
          <FaTrash size={14} />
        </button>
      </div>

      {error && <div className="chat-error">{error}</div>}

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.sender === "bot" ? (
              <div className="chatbot-response">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble bot loading-bubble">
            {getLoadingMessage()}
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-input-box">
        <input
          type="text"
          placeholder="Type your question or request..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          <FaPaperPlane />
        </button>
      </div>

    </div>
  );
};

export default Chatbot;
