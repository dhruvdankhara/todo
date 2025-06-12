import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./router/auth/user.js";
import todoRouter from "./router/todo/todo.js";
import errorHandler from "./middleware/error.middleware.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/todos", todoRouter);

app.use(errorHandler);

export default app;
