import { io } from "socket.io-client";

const socket = io("http://100.64.197.40:3001", {
  path: "/socket.io",
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
