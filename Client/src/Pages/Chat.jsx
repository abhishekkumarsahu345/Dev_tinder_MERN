/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Container from "../Components/Container";
import { IoIosSend } from "react-icons/io";
import { BASE_URL } from "../utils/constants";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
const Chat = () => {
  const { userId } = useParams();
  const socket = useRef(null);
  const { matches } = useSelector((state) => state.matches);
  const { user } = useSelector((state) => state.user);
  const targetUserId = matches.find((target) => target._id === userId);
  const loggedInuserId = user?._id;
  const msgUserId = targetUserId?._id;
  const [newMsg, setnewMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [typer, setTyper] = useState(false);
  const fetchMsgs = async () => {
    const res = await axios.get(BASE_URL + "conversation/" + msgUserId, {
      withCredentials: true,
    });
    setMessages(res.data);
  };
  useEffect(() => {
    if (!loggedInuserId || !msgUserId) return;

    fetchMsgs();
    socket.current = createSocketConnection();
    socket.current.emit("joinChat", { loggedInuserId, msgUserId });
    socket.current.on("messageRecieved", ({ text, sender }) => {
      setMessages((prev) => [...prev, { text, sender }]);
      setTyper(false);
    
    });
    socket.current.on("typing", () => setTyper(true));
    socket.current.on("stopTyping", () => setTyper(false));

    return () => {
      socket.current.disconnect();
    };
  }, [loggedInuserId, msgUserId]);
  useEffect(() => {
    //f (!newMsg) return;
    const roomID = [loggedInuserId, msgUserId].sort().join("_");
    if (!newMsg) {
  socket.current.emit("stopTyping", { roomID });
  return;
}
    socket.current.emit("typing", { sender: loggedInuserId, roomID });
    const timer = setTimeout(() => {
      socket.current.emit("stopTyping", { roomID });
    }, 1500);
    return () => clearTimeout(timer);
  }, [newMsg]);
  const sendMessage = () => {
    socket.current.emit("sendMessage", {
      loggedInuserId,
      msgUserId,
      text: newMsg,
    });

    setnewMsg("");
  };

  return (
    <Container>
      <div className="flex h-[550px] w-full max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* LEFT SIDE: User Profile/Bio Sidebar */}

        <div className="w-1/3 border-r border-slate-800 bg-slate-900/50 p-8 flex flex-col items-center text-center">
          {/* Avatar - uses profile image if available, else initials */}
          {targetUserId.photoUrl ? (
            <img
              src={targetUserId.photoUrl}
              alt={targetUserId.firstName}
              className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg border-2 border-indigo-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
              {targetUserId.firstName}
            </div>
          )}

          <h2 className="text-xl font-bold text-slate-100 mb-1">
            {targetUserId.firstName} {targetUserId.lastName}
          </h2>
          <p className="text-indigo-400 text-sm font-medium mb-6 uppercase tracking-tight">
            {targetUserId.profession || "ByteMate Memeber"}
          </p>

          <div className="w-full text-left">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Bio
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed italic">
              {targetUserId.about || "No bio provided yet."}
            </p>
          </div>

          <div className="mt-auto w-full pt-6 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Age</span>
              <span className="text-slate-300">
                {targetUserId.age || "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Gender</span>
              <span className="text-slate-300 capitalize">
                {targetUserId.gender || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Chat Component */}
        <div className="flex-1 flex flex-col bg-slate-950/20">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-200">
                Live Chat
              </span>
              {typer && (
                <div className="px-6 py-1">
                  <span className="text-xs text-indigo-400 animate-pulse">
                    {/* {targetUserId.firstName} is typing... */}
                    typing...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === loggedInuserId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender === loggedInuserId ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-slate-900/80">
            <div className="relative flex items-center">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setnewMsg(e.target.value)}
                placeholder="Write a message..."
                className="w-full bg-slate-800 border-none text-slate-200 text-sm rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                className="absolute right-2 p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                onClick={sendMessage}
              >
                <IoIosSend size={25} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default Chat;
