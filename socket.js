import { io } from "socket.io-client";

let socketinstance = null;

export function initializeSocket(project_id) {
  if (socketinstance) return socketinstance; // Prevent multiple initializations
  3000;
  socketinstance = io(import.meta.env.VITE_API_URL, {
    auth: { token: localStorage.getItem("token") },
    query: { project_id },
  });

  socketinstance.on("connect", () => {
    console.log("Connected to socket");
  });

  socketinstance.on("disconnect", () => {
    console.log("Disconnected from socket");
    socketinstance = null;
  });

  return socketinstance;
}

export const sendMessage = (eventName, data) => {
  if (!socketinstance) {
    console.error("Socket not initialized");
    return;
  }
  socketinstance.emit(eventName, data);
};

export const receiveMessage = (eventName, cb) => {
  if (!socketinstance) {
    console.error("Socket not initialized");
    return;
  }
  socketinstance.off(eventName); // Remove old listener to prevent duplicates
  socketinstance.on(eventName, cb);
};

export const disconnectSocket = () => {
  if (socketinstance) {
    socketinstance.disconnect();
    socketinstance = null;
  }
};
