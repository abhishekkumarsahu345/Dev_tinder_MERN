const socket = require("socket.io");
const { addmsgtoConversation } = require("../controller/msgController");
const onlineUsers = new Map();
const intializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ loggedInuserId, msgUserId }) => {
      const roomId = [loggedInuserId, msgUserId].sort().join("_");
      console.log(roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", async ({ loggedInuserId, msgUserId, text }) => {
      const roomId = [loggedInuserId, msgUserId].sort().join("_");
      console.log(msgUserId + "- send message =" + text);
      const participants = [loggedInuserId, msgUserId];
      const msg = {
        text,
        sender: loggedInuserId,
        reciever: msgUserId,
      };
      await addmsgtoConversation(participants, msg);
      io.to(roomId).emit("messageRecieved", { text, sender: loggedInuserId });
      const receiverSocketId = onlineUsers.get(msgUserId);
    });

    socket.on("typing", ({ roomID, sender }) => {
      socket.to(roomID).emit("typing", { sender });
    });

    socket.on("stopTyping", ({ roomID }) => {
      socket.to(roomID).emit("stopTyping");
    });

    socket.on("disconnect", () => {});
  });
};
module.exports = intializeSocket;
