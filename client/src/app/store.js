import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import todoReducer from "../features/todo/todoSlice";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => {
    if (import.meta.env.VITE_ENV === "development") {
      return getDefaultMiddleware().concat(logger);
    }
    return getDefaultMiddleware();
  },
});
