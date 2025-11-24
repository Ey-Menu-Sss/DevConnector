import React, { useEffect, useState, useRef } from "react";
import Header from "../components/dashboardHeader";
import axios from "axios";
import "../styles/dashboard.scss";
import {
  ChatListSkeleton,
  ChatWindowSkeleton,
} from "../components/LoadingSkeleton";
import { toast } from "react-toastify";

const Dashboard = () => {
  // --- State ---
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasChats, setHasChats] = useState("");
  const [hasMessages, setHasMessages] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [tab, setTab] = useState("chats");

  // --- Refs ---
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const usersRef = useRef([]);

  // --- User ---
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const socketUrl = "wss://devconnector-backend-yy5b.onrender.com/ws/chat/";
  // const socketUrl = "ws://localhost:8000/ws/chat/";

  // for sorting chats
  const toDate = (t) => {
    if (!t) return new Date(0); // 1970 → lowest priority
    return new Date(t.replace(" ", "T"));
  };

  // Redirect to login if no token
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  // --- WebSocket connection ---
  useEffect(() => {
    socketRef.current = new WebSocket(socketUrl);
    const socket = socketRef.current;

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      sendSignal("get_user_chats", { user_id: userId });
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      // server sends list of chats
      if (data.action === "user_chats") {
        !data.chats.length && setHasChats("nope");
        setUsers(
          [...data.chats].sort(
            (a, b) =>
              (a.last_message_time ? toDate(b.last_message_time) : 0) -
              (b.last_message_time ? toDate(a.last_message_time) : 0)
          )
        );
      }

      // when user opens chat → server sends messages
      if (data.action === "chat_messages") {
        data.messages.length && setHasMessages("");
        setMessages(data.messages);
      }

      // receiving a live message
      if (data.type === "chat_message") {
        const msg = data.message;
        setTab("chats")
        // Update messages
        setMessages((prev) => [...prev, msg]);

        // Update chat list
        setUsers((prevChats) => {
          const updated = prevChats.map((chat) =>
            chat.chat_id === msg.chat_id
              ? {
                  ...chat,
                  last_message: msg.text,
                  last_message_time: msg.time,
                }
              : chat
          );

          return updated.sort(
            (a, b) =>
              toDate(b.last_message_time || 0) -
              toDate(a.last_message_time || 0)
          );
        });
      }

      if (data.action === "all_users") {
        const mappedUsers = data.users.map((userItem) => {
          const existingChat = usersRef.current.find(
            (c) => c.user_id === userItem.id
          );
          return existingChat
            ? {
                ...userItem,
                user_id: existingChat.user_id,
                chat_id: existingChat.chat_id,
                last_message: existingChat.last_message,
                last_message_time: existingChat.last_message_time,
              }
            : userItem;
        });

        setAllUsers(
          [...mappedUsers].sort(
            (a, b) =>
              toDate(b?.last_message_time || 0) -
              toDate(a?.last_message_time || 0)
          )
        );
      }

      if (data.type === "new_chat_created") {
        setUsers((prev) =>
          [...prev, data.chat].sort(
            (a, b) =>
              toDate(b.last_message_time || 0) -
              toDate(a.last_message_time || 0)
          )
        );
      }
    };

    socket.onerror = () => console.log("Socket error");
    socket.onclose = () => console.log("Disconnected");
  }, []);

  // Auto-scroll to bottom when messages update
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  //
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  // Format message time to HH:MM
  const getCurrentTime = (t) => {
    const d = new Date(t);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Send message/action to websocket
  const sendSignal = (action, payload) => {
    socketRef.current.send(JSON.stringify({ action, message: { ...payload } }));
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    // console.log(messages);

    // If chat doesn't exist → create new chat
    if (!messages.length) {
      sendSignal("new_chat", {
        sender_id: userId,
        receiver_id: currentUser.id,
        text: messageInput,
      });
    } else {
      sendSignal("send_message", {
        sender_id: userId,
        receiver_id: currentUser.user_id,
        text: messageInput,
        chat_id: currentUser.chat_id,
      });
    }

    setMessageInput("");
  };

  // Press Enter to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // When user clicks a chat/user
  const handleShowChatWindow = (user) => {
    if (user.id === userId)
      return toast("It's you cmon😂", { type: "success" });

    if (window.innerWidth < 768) setShowChatOnMobile(true);

    if (user.chat_id) {
      sendSignal("get_messages", { chat_id: user.chat_id });
    } else {
      setMessages([]);
      setHasMessages("nope");
    }
    setCurrentUser(user);
  };

  // Search users
  const handleSearchUser = async (text) => {
    try {
      const { data } = await axios.get(`/search/?q=${text}`);

      // attach existing chat_id to search results
      const mapped = data.map((item) => {
        const u = users.find((c) => c.user_id === item.id);
        return u
          ? {
              ...item,
              user_id: u.user_id,
              last_message: u.last_message,
              last_message_time: u.last_message_time,
              chat_id: u.chat_id,
            }
          : item;
      });

      setSearchingUsers(
        [...mapped].sort(
          (a, b) =>
            toDate(b.last_message_time || 0) - toDate(a.last_message_time || 0)
        )
      );
    } catch {}
  };

  return (
    <div>
      <Header />

      <div className="chatContainer">
        <div className="chatSection">
          {/* ---------------- Chat List ---------------- */}
          <div
            className={`chatList ${showChatOnMobile ? "mobile-hidden" : ""}`}
          >
            {/* Search box */}
            <div className="chatSearch">
              <i className="bx bx-search"></i>
              <input
                type="text"
                placeholder="Search users or chats"
                value={searchInput}
                onFocus={() => setIsSearching(true)}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  handleSearchUser(e.target.value);
                }}
              />
              {isSearching && (
                <i
                  className="bx bx-x"
                  onClick={() => {
                    setIsSearching(false);
                    setSearchInput("");
                    setSearchingUsers([]);
                  }}
                ></i>
              )}
            </div>

            {/* Tabs */}
            <div className="chatTabs">
              <div
                className={`chatTab ${tab === "chats" ? "active" : ""}`}
                onClick={() => {
                  setTab("chats");
                  setIsSearching(false);
                  setMessageInput("");
                  setSearchingUsers([]);
                }}
              >
                <i className="bx bx-message-dots"></i> My Chats
              </div>

              <div
                className={`chatTab ${tab === "all_users" ? "active" : ""}`}
                onClick={() => {
                  setTab("all_users");
                  sendSignal("get_all_users", {});
                  setIsSearching(false);
                  setMessageInput("");
                  setSearchingUsers([]);
                }}
              >
                <i className="bx bx-group"></i> All users
              </div>
            </div>

            {/* No chats */}
            {hasChats === "nope" && tab === "chats" && !isSearching && (
              <div className="emptyState">
                <p>
                  You have no chats :( <br /> Search users and start a chat.
                </p>
              </div>
            )}

            {/* Loading chats */}
            {!users.length && hasChats === "" && <ChatListSkeleton />}

            {/* Chats list */}
            <div className="chats">
              {/* If searching → show searchingUsers */}
              {isSearching ? (
                searchingUsers.length ? (
                  searchingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="chatItem"
                      onClick={() => handleShowChatWindow(user)}
                    >
                      <div
                        className="userImg"
                        style={{ backgroundColor: "#6366f1" }}
                      ></div>
                      <div className="chatContent">
                        <div className="userName">{user.name}</div>
                        <div className="lastMessage">
                          {user.last_message || ""}
                        </div>
                      </div>
                      <div className="lastmessage_time">
                        <p className="l_time">
                          {user.last_message_time &&
                            getCurrentTime(user.last_message_time)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="emptyState">No users found</p>
                )
              ) : tab === "chats" ? (
                users.map((chat) => (
                  <div
                    key={chat.chat_id}
                    className="chatItem"
                    onClick={() => handleShowChatWindow(chat)}
                  >
                    <div
                      className="userImg"
                      style={{ backgroundColor: "#6366f1" }}
                    ></div>
                    <div className="chatContent">
                      <div className="userName">{chat.name}</div>
                      <div className="lastMessage">
                        {chat.last_message || "No messages"}
                      </div>
                    </div>
                    <div className="lastmessage_time">
                      <p className="l_time">
                        {chat.last_message_time &&
                          getCurrentTime(chat.last_message_time)}
                      </p>
                    </div>
                  </div>
                ))
              ) : tab === "all_users" ? (
                allUsers.map((user) => (
                  <div
                    key={user.id}
                    className="chatItem"
                    onClick={() => handleShowChatWindow(user)}
                  >
                    <div
                      className="userImg"
                      style={{ backgroundColor: "#6366f1" }}
                    ></div>
                    <div className="chatContent">
                      <div className="userName">{user.name}</div>
                      <div className="lastMessage">{user.last_message}</div>
                    </div>
                    <div className="lastmessage_time">
                      <p className="l_time">
                        {user.last_message_time &&
                          getCurrentTime(user.last_message_time)}
                      </p>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </div>

          {/* ---------------- Chat Window ---------------- */}
          {currentUser ? (
            <div
              className={`chatWindow ${
                !showChatOnMobile ? "mobile-hidden" : ""
              }`}
            >
              {/* Header */}
              <div className="chatHeader">
                <div className="headerUserInfo">
                  {window.innerWidth < 768 && (
                    <button
                      className="backBtn"
                      onClick={() => setShowChatOnMobile(false)}
                    >
                      <i className="bx bx-left-arrow-alt"></i>
                    </button>
                  )}
                  <div className="headerUserDetails">
                    <div className="headerUserName">{currentUser.name}</div>
                    <div className="headerUserStatus">online</div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="messagesArea">
                {hasMessages === "nope" && (
                  <div className="emptyState">
                    <p>
                      No messages here yet... <br /> Start the conversation!
                    </p>
                  </div>
                )}
                {/* {!messages.length && hasMessages === "" && (
                  <ChatWindowSkeleton />
                )} */}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`message ${
                      m.sender_id === userId ? "sent" : "received"
                    }`}
                  >
                    <div className="messageContent">
                      <div className="messageText">{m.text}</div>
                      <div className="messageTime">
                        {getCurrentTime(m.time)}
                      </div>
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
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
            <div className="chatWindow">
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
