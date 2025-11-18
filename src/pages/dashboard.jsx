import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/dashboardHeader";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Education, Experience, UserAllInfo } from "../store/slices/user";
import { toast } from "react-toastify";
import "../styles/dashboard.scss";
import { DashboardSkeleton } from "../components/LoadingSkeleton";
import { act } from "react";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);

  const [users, setUsers] = useState([]);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const [searchingUsers, setSearchingUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("userinfo"));
  const userId = user ? user.user._id : null;
  // const socketUrl = `ws://localhost:8000/ws/chat/`;
  const socketUrl = `wss://devconnector-backend-yy5b.onrender.com/ws/chat/`;

  const navigate = useNavigate();

  if (!localStorage.getItem("token")) {
    useEffect(() => navigate("/login"), []);
  }

  useEffect(() => {
    // Create WebSocket connection
    socketRef.current = new WebSocket(`${socketUrl}`);
    const socket = socketRef.current;

    //  Connection opened

    socket.onopen = (event) => {
      console.log("connected to websocket!");
      console.log(userId);
      sendSignal("get_user_chats", { user_id: userId });
    };

    //
    //   Receive messages from the server
    //

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data?.action === "user_chats") {
        let chats = data.chats;
        console.log(chats);
        setUsers(chats);
      }
      if (data?.action === "chat_messages") {
        console.log(data.messages);
        setMessages(data.messages);
      }
      if (data?.type === "chat_message") {
        let new_message = data.message;
        console.log(new_message);

        setMessages((prev) => [...prev, new_message]);
      }
    };

    // Handle WebSocket errors and closure

    socket.onerror = (error) => {
      console.log("Error!!!");

      // Handle error
    };

    // Connection closed

    socket.onclose = (event) => {
      console.log("Disconnected!");

      // Connection closed
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getCurrentTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const sendSignal = (action, message) => {
    socketRef.current.send(
      JSON.stringify({
        action: action,
        message: {
          ...message,
        },
      })
    );
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    console.log("messages:", messages);

    !messages.length
      ? sendSignal("new_chat", {
          sender_id: userId,
          receiver_id: currentUser.id,
          text: messageInput,
        })
      : sendSignal("send_message", {
          sender_id: userId,
          receiver_id: currentUser.user_id,
          text: messageInput,
          chat_id: currentUser.chat_id,
        });

    // const newMessage = {
    //   id: messages.length + 1,
    //   text: messageInput.trim(),
    //   time: getCurrentTime(),
    //   type: "sent",
    // };

    // setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleShowChatWindow = (user) => {
    if (window.innerWidth < 768) {
      setShowChatOnMobile(true);
    }

    console.log("currentuser:", user);
    user?.chat_id
      ? sendSignal("get_messages", {
          chat_id: user.chat_id,
        })
      : setMessages([]);

    setCurrentUser(user);
    setMessages([]);
  };

  async function handleSearchUser(e) {
    try {
      const { data } = await axios.get(`/search/?q=${e}`);

      const new_data = data.map((item) => {
        const matchedUser = users.find((user) => user.user_id === item.id);
        return matchedUser ? { ...item, chat_id: matchedUser.chat_id } : item;
      });

      setSearchingUsers(new_data);
    } catch (err) {}
  }

  return (
    <div>
      <Header />

      <div className="chatContainer">
        {/* <h2>
          <i className="bx bxs-message-dots"></i> Welcome back, {name}. Start a chat or search for users.
        </h2> */}

        <div className="chatSection">
          {/* 
                    Chat List Area
                                      */}

          <div className={`chatList ${showChatOnMobile ? "mobile-hidden" : ""}`}>
            <div className="chatSearch">
              <i className="bx bx-search"></i>
              <input
                type="text"
                placeholder="Search users or chats"
                aria-label="Search"
                onFocus={() => setIsSearching(true)}
                onChange={(e) => handleSearchUser(e.target.value)}
              />
              {isSearching && (
                <i
                  className="bx bx-x"
                  onClick={() => setIsSearching(false)}
                ></i>
              )}
            </div>
            {!users.length && (
              <div className="emptyState">
                <p>search and contact with users</p>
              </div>
            )}
            {/* ---- if search input not on focus, and user has chats */}

            <div className="chats">
              {!isSearching &&
                users?.map((user, index) => (
                  <div
                    className="chatItem"
                    key={index}
                    onClick={() => handleShowChatWindow(user)}
                  >
                    <div
                      className="userImg"
                      style={{ backgroundColor: "#6366f1" }}
                    ></div>
                    <div className="chatContent">
                      <div className="userName">{user.name}</div>
                      <div className="lastMessage">{user.lastMessage}</div>
                    </div>
                  </div>
                ))}

              {/* --- showing the searching lists */}

              {isSearching &&
                searchingUsers?.map((user) => (
                  <div
                    className="chatItem"
                    key={user.id}
                    onClick={() => handleShowChatWindow(user)}
                  >
                    <div
                      className="userImg"
                      style={{ backgroundColor: "#6366f1" }}
                    ></div>
                    <div className="chatContent">
                      <div className="userName">{user.name}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 
                    Chat Window Area
                                        */}

          {currentUser ? (
            <div className={`chatWindow ${!showChatOnMobile ? "mobile-hidden" : ""}`}>
              <div className="chatHeader">
                <div className="headerUserInfo">
                  <div className="headerUserDetails">
                    {window.innerWidth < 768 && (
                      <button
                        className="backBtn"
                        onClick={() => setShowChatOnMobile(false)}
                      >
                        <i className="bx bx-chevron-left"></i>
                      </button>
                    )}
                    <div className="headerUserName">{currentUser?.name}</div>
                    <div className="headerUserStatus">online</div>
                  </div>
                </div>
                <div className="headerActions">
                  <button className="headerBtn" aria-label="More options">
                    <i className="bx bx-dots-vertical-rounded"></i>
                  </button>
                </div>
              </div>

              {/* 
                   Messages Area
                                  */}

              <div className="messagesArea">
                {!messages.length && (
                  <div className="emptyState">
                    <p>
                      No messages here yet... <br /> Start the conversation!
                    </p>
                  </div>
                )}
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${
                      message.sender_id === userId ? "sent" : "received"
                    }`}
                  >
                    <div className="messageContent">
                      <div className="messageText">{message.text}</div>
                      <div className="messageTime">
                        {getCurrentTime(message.time)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* 
                    Input Area
                                  */}

              <div className="chatInputArea">
                <button className="attachBtn" aria-label="Attach file">
                  <i className="bx bx-paperclip"></i>
                </button>
                <div className="inputWrapper">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="messageInput"
                    aria-label="Type a message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <button
                  className="sendBtn"
                  aria-label="Send message"
                  onClick={handleSendMessage}
                  disabled={messageInput.trim() === ""}
                >
                  <i className="bx bx-send"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className={`chatWindow ${!showChatOnMobile ? "mobile-hidden" : ""}`}>
              <div className="emptyState">
                <h2>Select a chat to start messaging</h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
