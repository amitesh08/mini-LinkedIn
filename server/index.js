import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";

dotenv.config();
connectDB();

const app = express();

//for cors
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true, // this is required for sending cookies
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use(
  express.urlencoded({
    //to send data via URL
    extended: true,
  })
);
//to access cookies
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
