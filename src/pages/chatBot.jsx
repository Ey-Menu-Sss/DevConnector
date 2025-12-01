import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import RegisterHeader from "../components/registerHeader";
import Header from "../components/dashboardHeader";
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
    const messageToSend = message.trim();
    setLoading(true);
    setResponse("");
    setMessage(""); // Clear input after sending

    try {
      const res = await axios.post("/openai/", { message: messageToSend });
      setResponse(res.data.response);
      setLoading(false);
    } catch (err) {
      toast("Failed to get AI response", { type: "error" });
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey && !loading) {
      e.preventDefault();
      sendMessage();
    }
    // Ctrl+Enter or Shift+Enter allows new line (default behavior)
  };

  return (
    <div>
      {localStorage.getItem("token") ? <Header /> : <RegisterHeader />}
      <div className="chatbot_container">
        <div className="chatbot_header">
          <div className="chatbot_title_section">
            <i className="bx bx-bot"></i>
            <h1>WORTEX AI Bot</h1>
          </div>
          <p className="chatbot_subtitle">Ask me anything and I'll help you!</p>
        </div>

        <div className="chatbot_content">
          <div className="chat_input_section">
            <div className="input_wrapper">
              <textarea
                className="chat_input"
                rows="4"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
              <div className="input_footer">
                <span className="input_hint">Press Enter to send</span>
                <button 
                  onClick={sendMessage} 
                  className="chat_button" 
                  disabled={loading || !message.trim()}
                >
                  {loading ? (
                    <>
                      <i className="bx bx-loader-alt bx-spin"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-send"></i>
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {response && (
            <div className="chat_response_section">
              <div className="response_header">
                <i className="bx bx-bot"></i>
                <h3>AI Response</h3>
              </div>
              <div className="chat_response">
                {response.split("\n").map((line, index) => 
                  line.trim() ? <p key={index}>{line}</p> : <br key={index} />
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="chat_response_section loading_state">
              <div className="response_header">
                <i className="bx bx-bot"></i>
                <h3>AI is thinking...</h3>
              </div>
              <div className="loading_dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
