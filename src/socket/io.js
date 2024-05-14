const socketIo = require("socket.io");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    transports: ["websocket", "polling"],
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.handshake.query.name);
    socket.join(socket.handshake.query.location);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
}

module.exports = {
  initializeSocket,
  getIo,
};