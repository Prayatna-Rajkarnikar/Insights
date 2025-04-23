import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Server } from "socket.io";

import { dbConnect } from "./mongo/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import commentRoutes from "./routes/commentRoute.js";
import blogRoutes from "./routes/blogRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import slangwordRoute from "./routes/slangwordRoute.js";
import topicRoute from "./routes/topicRoutes.js";
import searchRoute from "./routes/searchRoute.js";
import flagRoute from "./routes/flagRoutes.js";
import roomRoute from "./routes/roomRoutes.js";
import messageRoute from "./routes/messageRoutes.js";
import { setSlangwords } from "./controllers/slangwordController.js";
import messageModel from "./models/messageModel.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());
app.use(morgan("combined"));

//parse the cookies and make them available in req.cookies
app.use(cookieParser());

//allows to access form data
app.use(express.urlencoded({ extended: false }));

//import.meta.url gives you the current module’s file URL
//converts that file URL to a regular path string.
//file:///Users/name/project/index.js to /Users/name/project/index.js
const __filename = fileURLToPath(import.meta.url);

// Extracts just the directory part from __filename
// /Users/name/project
const __dirname = path.dirname(__filename);

// serve static files (like images, CSS, JS, etc.) from a folder called public
app.use(express.static(path.join(__dirname, "./public")));
dbConnect();

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/comments", commentRoutes);
app.use("/blog", blogRoutes);
app.use("/like", likeRoutes);
app.use("/slangword", slangwordRoute);
app.use("/topic", topicRoute);
app.use("/search", searchRoute);
app.use("/flag", flagRoute);
app.use("/room", roomRoute);
app.use("/message", messageRoute);

// Reads a file asynchronously.
// Builds the full file path
// utf Specifies the encoding, so the content is read as a human-readable string
fs.readFile(path.join(__dirname, "slangwords.json"), "utf8", (error, data) => {
  try {
    let words = JSON.parse(data);
    setSlangwords(words);
  } catch (error) {
    console.error("Error parsing slangwords.json:", error.message);
  }
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// Creates a new Socket.IO server instance and attaches it to an existing HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://192.168.1.7:3001", //
    credentials: true,
  },
});

// Listens for new client connections.
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room
  socket.on("joinRoom", ({ roomId, user }) => {
    console.log(`${user.name} joined room ${roomId}`);
    socket.join(roomId);
  });

  //send message
  socket.on("sendMessage", async ({ roomId, message, user }) => {
    try {
      const newMessage = new messageModel({
        roomId,
        user: user._id,
        message,
      });
      await newMessage.save();

      // Emit the message to the room with the correct user information
      // ensures only users in that room receive the message.
      io.to(roomId).emit("receiveMessage", {
        _id: newMessage._id,
        message: newMessage.message,
        user: {
          _id: user._id,
          name: user.name,
        },
        createdAt: newMessage.createdAt,
      });

      console.log(`Message from ${user.name}: ${message}`);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Logs when a user disconnects.
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.setTimeout(10 * 60 * 1000);
