import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createTodoApi,
  deleteTodoApi,
  fetchAllTodosApi,
  toggleCompleteApi,
  updateTodoApi,
} from "../../api";

export const fetchAllTodos = createAsyncThunk("fetchAllTodos", async () => {
  const response = await fetchAllTodosApi();
  return response.data.data;
});

export const createTodo = createAsyncThunk("createtTodo", async (content) => {
  const response = await createTodoApi(content);
  return response.data.data;
});

export const deleteTodo = createAsyncThunk("deleteTodo", async (id) => {
  const response = await deleteTodoApi(id);
  return response.data.data;
});

export const toggleTodo = createAsyncThunk("toggleTodo", async (id) => {
  const response = await toggleCompleteApi(id);
  return response.data.data;
});

export const updateTodo = createAsyncThunk(
  "updateTodo",
  async ({ id, content }) => {
    const response = await updateTodoApi(id, content);
    return response.data.data;
  }
);

const initialState = {
  todos: [],
  isLoading: false,
  isError: false,
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllTodos.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllTodos.fulfilled, (state, action) => {
      state.todos = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createTodo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createTodo.fulfilled, (state, action) => {
      state.todos.push(action.payload);
      state.isLoading = false;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.todos = state.todos.filter(
        (todo) => todo._id != action.payload._id
      );
    });
    builder.addCase(toggleTodo.fulfilled, (state, action) => {
      state.todos = state.todos.map((todo) =>
        todo._id == action.payload._id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo
      );
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      console.log("🚀 ~ builder.addCase ~ state.todos:", state.todos);
      state.todos = state.todos.map((todo) =>
        todo._id == action.payload._id
          ? { ...todo, content: action.payload.content }
          : todo
      );
      console.log("🚀 ~ builder.addCase ~ state.todos:", state.todos);
    });
  },
});

export default todoSlice.reducer;
