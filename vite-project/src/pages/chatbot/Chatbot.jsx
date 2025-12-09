import { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Thanks! I'll assist you shortly." }
      ]);
    }, 800);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-xl shadow-md border border-gray-200">
      
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-xl">
        <h2 className="text-xl font-semibold text-gray-800">Chatbot Assistant</h2>
        <p className="text-gray-500 text-sm">Ask anything about your career or modules</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring focus:ring-blue-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );

  
}
