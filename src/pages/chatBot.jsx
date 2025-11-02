import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/chatBot.scss";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      toast("Please enter a message", { type: "warning" });
      return;
    }
    setLoading(true);

    if (message) {
      try {
        const res = await axios.post("/openai/", { message });
        setResponse(res.data.response);
        setLoading(false);
      } catch (err) {
        toast("Failed to get AI response", { type: "error" });
      }
    }
  };

  return (
    <div className="chat-container">
      <h2>WORTEX AI Bot</h2><br />

      <textarea
        className="chat-input"
        rows="4"
        placeholder="Ask something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage} className="chat-button" disabled={loading}>
        {loading ? "Loading..." : "Send"}
      </button>

      <div className="chat-response">
        {response &&
          response.split("\n").map((line, index) => <p key={index}>{line}</p>)}
      </div>
    </div>
  );
};

export default ChatBot;
