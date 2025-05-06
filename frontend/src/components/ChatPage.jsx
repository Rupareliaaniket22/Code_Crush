import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL, DEFAULT_PHOTO_URL } from "../utils/constants";
// Import icons from react-icons
import { BiMessageDetail } from "react-icons/bi";
import {
  FiArrowLeft,
  FiCheck,
  FiMessageCircle,
  FiMessageSquare,
  FiSend,
  FiUsers,
} from "react-icons/fi";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const user = useSelector((state) => state.user);
  const { toUserId } = useParams();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      setConnections(res.data || []);

      // If toUserId is provided in URL params, select that chat
      if (toUserId && res.data) {
        const matchingConnection = res.data.find(
          (conn) => conn._id === toUserId
        );
        if (matchingConnection) {
          setSelectedChatId(toUserId);
          setChats((prev) =>
            prev.some((c) => c._id === toUserId)
              ? prev
              : [...prev, { ...matchingConnection, messages: [] }]
          );
        }
      }
      // If no specific chat is specified but connections exist, select the first one
      else if (res.data && res?.data?.length > 0) {
        setSelectedChatId(res.data[0]._id);
        setChats((prev) =>
          prev.some((c) => c._id === res.data[0]._id)
            ? prev
            : [...prev, { ...res.data[0], messages: [] }]
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`${BASE_URL}/chats/${chatId}`, {
        withCredentials: true,
      });
      const messages = res.data?.messages || [];
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                messages: messages.map((msg) => ({
                  text: msg.text,
                  sender: msg.senderId === user._id ? "me" : "them",
                  time: new Date(msg.createdAt),
                })),
              }
            : chat
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
    if (user) socketRef.current = createSocketConnection(user);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
      socketRef.current.emit("joinRoom", {
        fullName: user?.firstName + " " + user?.lastName,
        fromUserId: user._id,
        toUserId: selectedChatId,
      });
    }
  }, [selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, selectedChatId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedChatId) return;

    const newMsg = { text: inputMessage, sender: "me", time: new Date() };
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === selectedChatId
          ? { ...chat, messages: [...(chat.messages || []), newMsg] }
          : chat
      )
    );

    socketRef.current.emit("sendMessage", {
      fromUserId: user._id,
      toUserId: selectedChatId,
      text: inputMessage,
    });
    setInputMessage("");
  };

  useEffect(() => {
    if (!socketRef.current) return;
    const onReceive = ({ fromUserId, text, timeStamp }) => {
      setChats((prev) =>
        prev?.map((chat) =>
          chat._id === fromUserId
            ? {
                ...chat,
                messages: [
                  ...(chat.messages || []),
                  { text, sender: "them", time: new Date(timeStamp) },
                ],
              }
            : chat
        )
      );
    };
    socketRef.current.on("receiveMessage", onReceive);
    return () => socketRef.current.off("receiveMessage", onReceive);
  }, []);

  const handleChatSelect = (chat) => {
    setSelectedChatId(chat._id);
    setChats((prev) =>
      prev.some((c) => c._id === chat._id)
        ? prev
        : [...prev, { ...chat, messages: [] }]
    );
  };

  const selectedChat = connections?.find((c) => c._id === selectedChatId);

  return (
    <div className="h-screen flex flex-col md:flex-row pt-16 bg-base-200 overflow-scroll">
      {/* Sidebar / Chat list */}
      <aside
        className={`bg-base-100 md:border-r md:w-80 w-full flex flex-col transition-all duration-300 ease-in-out
        ${selectedChatId ? "hidden md:flex" : "flex"} shadow-xl z-10`}
      >
        <div className="p-4 font-semibold text-2xl text-primary border-b border-base-300 flex items-center gap-3">
          <BiMessageDetail className="h-7 w-7" />
          Chats
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : connections?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center text-base-content/60">
              <FiUsers className="h-16 w-16 mb-4 text-base-content/30" />
              <p className="text-lg font-semibold mb-2">No connections</p>
              <p className="mb-4 text-sm">
                Connect with others to start chatting
              </p>
              <Link to="/feed" className="btn btn-primary btn-sm rounded-full">
                Find People
              </Link>
            </div>
          ) : (
            connections?.map((conn) => {
              const chat = chats.find((c) => c._id === conn._id);

              return (
                <div
                  key={conn._id}
                  onClick={() => handleChatSelect(conn)}
                  className={`flex items-center p-4 hover:bg-base-200/50 cursor-pointer border-b border-base-200 transition-colors duration-200
                    ${selectedChatId === conn._id ? "bg-base-200" : ""}`}
                >
                  <div className="relative">
                    <img
                      src={conn.photoUrl || DEFAULT_PHOTO_URL}
                      alt="avatar"
                      className="h-12 w-12 rounded-full object-cover border-2 border-base-300 mr-3 shadow-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-base truncate">
                        {conn.firstName} {conn.lastName}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <section
        className={`flex-1 flex flex-col ${
          selectedChatId ? "flex" : "hidden md:flex"
        } bg-base-100 relative`}
      >
        {/* Chat Header */}
        <header className="flex fixed w-full  items-center p-4 border-b bg-base-100 z-50 shadow-sm">
          {selectedChat ? (
            <>
              <button
                className="md:hidden btn btn-ghost btn-sm mr-3 -ml-2"
                onClick={() => setSelectedChatId(null)}
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={selectedChat.photoUrl || DEFAULT_PHOTO_URL}
                    alt="avatar"
                    className="h-10 w-10 rounded-full object-cover border border-base-300 shadow-sm"
                  />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-primary">
                    {selectedChat.firstName} {selectedChat.lastName}
                  </h2>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full">
              <h2 className="text-xl font-semibold text-base-content/60">
                Select a conversation
              </h2>
            </div>
          )}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-base-100/50">
          {selectedChatId ? (
            <>
              {(chats.find((c) => c._id === selectedChatId)?.messages || [])
                ?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-base-content/50">
                  <div className="bg-base-200 rounded-full p-6 mb-4">
                    <FiMessageCircle className="h-12 w-12" />
                  </div>
                  <p className="text-lg font-semibold">No messages yet</p>
                  <p className="text-sm mt-2">
                    Send a message to start the conversation
                  </p>
                </div>
              ) : (
                (
                  chats.find((c) => c._id === selectedChatId)?.messages || []
                ).map((msg, i) => {
                  const currentDate = msg.time.toLocaleDateString();
                  const prevDate =
                    i > 0
                      ? (
                          chats.find((c) => c._id === selectedChatId)?.messages[
                            i - 1
                          ]?.time || new Date()
                        ).toLocaleDateString()
                      : null;
                  const showDateDivider = i === 0 || currentDate !== prevDate;

                  return (
                    <React.Fragment key={i}>
                      {showDateDivider && (
                        <div className="flex justify-center my-4">
                          <div className="bg-base-200 text-xs px-3 py-1 rounded-full text-base-content/60 shadow-sm">
                            {currentDate === new Date().toLocaleDateString()
                              ? "Today"
                              : currentDate}
                          </div>
                        </div>
                      )}

                      <div
                        className={`chat ${
                          msg.sender === "me" ? "chat-end" : "chat-start"
                        } animate-fade-in`}
                      >
                        {/* Always show avatar for every message from "them" */}
                        {msg.sender === "them" && (
                          <div className="chat-image avatar">
                            <div className="w-8 rounded-full">
                              <img
                                src={
                                  selectedChat?.photoUrl || DEFAULT_PHOTO_URL
                                }
                                alt="User avatar"
                              />
                            </div>
                          </div>
                        )}

                        <div
                          className={`chat-bubble max-w-xs md:max-w-md rounded-2xl shadow-sm ${
                            msg.sender === "me"
                              ? "chat-bubble-primary text-primary-content"
                              : "bg-base-200 text-base-content"
                          } ${
                            msg.sender === "me"
                              ? "bubble-tail-right"
                              : "bubble-tail-left"
                          } px-4 py-2`}
                        >
                          {msg.text}
                        </div>

                        <div className="chat-footer opacity-60 text-xs flex gap-1 mt-1">
                          {msg.time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {msg.sender === "me" && (
                            <FiCheck className="h-3 w-3 self-end" />
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-base-content/50">
              <div className="bg-base-200 rounded-full p-8 mb-6">
                <FiMessageSquare className="h-16 w-16" />
              </div>
              <p className="text-xl font-semibold">Select a conversation</p>
              <p className="text-base mt-2">
                Choose a contact to start messaging
              </p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedChatId && (
          <form
            onSubmit={handleSend}
            className="p-4 bg-base-100 border-t flex items-center gap-3 shadow-sm"
          >
            {/* Removed emoji button */}
            {/* Removed gallery/photo button */}
            <input
              className="input input-bordered flex-1 bg-base-200 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="btn btn-primary btn-circle shadow-md hover:shadow-lg transition-shadow"
              disabled={!inputMessage.trim()}
            >
              <FiSend className="h-5 w-5" />
            </button>
          </form>
        )}
      </section>

      {/* Custom CSS for animations and message bubble styling */}
      <style jsx="true">{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bubble-tail-right::after {
          content: "";
          position: absolute;
          bottom: 6px;
          right: -8px;
          width: 0;
          height: 0;
          border-bottom: 8px solid transparent;
          border-left: 8px solid hsl(var(--p));
        }

        .bubble-tail-left::after {
          content: "";
          position: absolute;
          bottom: 6px;
          left: -8px;
          width: 0;
          height: 0;
          border-bottom: 8px solid transparent;
          border-right: 8px solid hsl(var(--b2));
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
