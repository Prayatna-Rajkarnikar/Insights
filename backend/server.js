import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

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
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, "../client/public")));
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

app.listen(process.env.PORT, () => {
  console.log(`Server Connected Successfully on PORT ${process.env.PORT}`);
});
