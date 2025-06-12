import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./todosSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
