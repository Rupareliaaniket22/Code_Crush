import { io } from "socket.io-client";
import { BASE_URL } from "./constants";
import { useSelector } from "react-redux";

export const createSocketConnection = (user) => {
  if (location.hostname === "localhost") {
    return io(BASE_URL, {
      withCredentials: true,
    });
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};
