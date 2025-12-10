// socket.js
module.exports = function(io) {
  
  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("join-document", (documentId) => {
      socket.join(documentId);
      console.log(`Socket ${socket.id} joined document ${documentId}`);
    });

    socket.on("send-changes", ({ documentId, content }) => {
      socket.to(documentId).emit("receive-changes", content);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

};
