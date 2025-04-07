// utils/socket.js
import { io } from "socket.io-client";

// Replace with your backend IP if testing on real device
const socket = io("http://localhost:3001", {
  transports: ["websocket"], // 👈 recommended for React Native
});

export default socket;
