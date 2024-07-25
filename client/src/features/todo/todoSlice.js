import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createTodoApi,
  deleteTodoApi,
  fetchAllTodosApi,
  toggleCompleteApi,
  updateTodoApi,
} from "../../api";

import { toast } from "react-hot-toast";

export const fetchAllTodos = createAsyncThunk("fetchAllTodos", async () => {
  toast.loading("Fetching Todos...");
  const response = await fetchAllTodosApi();
  return response.data;
});

export const createTodo = createAsyncThunk("createtTodo", async (content) => {
  const response = await createTodoApi(content);
  return response.data;
});

export const deleteTodo = createAsyncThunk("deleteTodo", async (id) => {
  const response = await deleteTodoApi(id);
  return response.data;
});

export const toggleTodo = createAsyncThunk("toggleTodo", async (id) => {
  const response = await toggleCompleteApi(id);
  return response.data;
});

export const updateTodo = createAsyncThunk(
  "updateTodo",
  async ({ id, content }) => {
    const response = await updateTodoApi(id, content);
    return response.data;
  }
);

const initialState = {
  todos: [],
  isLoading: false,
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllTodos.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllTodos.rejected, (state) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error("Failed to fetch Todos");
    });
    builder.addCase(fetchAllTodos.fulfilled, (state, action) => {
      state.todos = action.payload.data;
      state.isLoading = false;
      toast.dismiss();
      toast.success(action.payload.message);
    });
    builder.addCase(createTodo.pending, (state) => {
      toast.loading("Adding Todo...");
      state.isLoading = true;
    });
    builder.addCase(createTodo.rejected, (state) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error("Failed to add Todo");
    });
    builder.addCase(createTodo.fulfilled, (state, action) => {
      state.todos.push(action.payload.data);
      state.isLoading = false;
      toast.dismiss();
      toast.success(action.payload.message);
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.todos = state.todos.filter(
        (todo) => todo._id != action.payload.data._id
      );
      toast.success(action.payload.message);
    });
    builder.addCase(toggleTodo.fulfilled, (state, action) => {
      state.todos = state.todos.map((todo) =>
        todo._id == action.payload.data._id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo
      );
      toast.success(action.payload.message);
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      state.todos = state.todos.map((todo) =>
        todo._id == action.payload.data._id
          ? { ...todo, content: action.payload.content }
          : todo
      );
      toast.success(action.payload.message);
    });
  },
});

export default todoSlice.reducer;
