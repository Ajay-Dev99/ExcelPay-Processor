import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("join-room", (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined room user-${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });

};

export const getIO = () => {

  if (!io) {
    throw new Error("Socket not initialized");
  }

  return io;

};