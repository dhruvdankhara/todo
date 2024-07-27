import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import {
  createTodoApi,
  deleteTodoApi,
  fetchAllTodosApi,
  toggleCompleteApi,
  updateTodoApi,
} from "../../api";

export const fetchAllTodos = createAsyncThunk(
  "todo/fetchAllTodos",
  async () => {
    const response = await fetchAllTodosApi();
    return response.data;
  }
);

export const createTodo = createAsyncThunk(
  "todo/createtTodo",
  async (content) => {
    const response = await createTodoApi(content);
    return response.data;
  }
);

export const deleteTodo = createAsyncThunk("todo/deleteTodo", async (id) => {
  const response = await deleteTodoApi(id);
  return response.data;
});

export const toggleTodo = createAsyncThunk("todo/toggleTodo", async (id) => {
  const response = await toggleCompleteApi(id);
  return response.data;
});

export const updateTodo = createAsyncThunk(
  "todo/updateTodo",
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
  extraReducers: (builder) => {
    builder.addCase(fetchAllTodos.pending, (state) => {
      state.isLoading = true;
      toast.loading("Fetching Todos...");
    });
    builder.addCase(fetchAllTodos.rejected, (state, action) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(action.payload.message);
    });
    builder.addCase(fetchAllTodos.fulfilled, (state, action) => {
      state.todos = action.payload.data;
      state.isLoading = false;
      toast.dismiss();
      toast.success(action.payload.message);
    });
    builder.addCase(createTodo.pending, () => {
      toast.loading("Adding Todo...");
    });
    builder.addCase(createTodo.rejected, (state, action) => {
      toast.dismiss();
      toast.error(action.payload.message);
    });
    builder.addCase(createTodo.fulfilled, (state, action) => {
      state.todos.push(action.payload.data);
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
