import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // if you need to include cookies
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./router/auth/user.js";
import todoRouter from "./router/todo/todo.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/todos", todoRouter);

export default app;
