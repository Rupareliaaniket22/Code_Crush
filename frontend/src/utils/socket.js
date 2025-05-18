import { io } from "socket.io-client";

const socketUrl =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://codecrush-production.up.railway.app";

export const createSocketConnection = () => {
  return io(socketUrl, {
    withCredentials: true,
    path: "/socket.io",
    transports: ["websocket"], // optional but can help avoid polling issues
  });
};
