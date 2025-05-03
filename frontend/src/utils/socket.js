import { io } from "socket.io-client";
import { BASE_URL } from "./constants";
import { useSelector } from "react-redux";

export const createSocketConnection = (user) => {
  return io(BASE_URL, {
    withCredentials: true,
    query: { userId: user._id },
    auth: { token: localStorage.getItem("token") },
  });
};
