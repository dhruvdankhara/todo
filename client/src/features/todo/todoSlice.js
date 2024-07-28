import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import {
  createTodoApi,
  deleteTodoApi,
  fetchAllTodosApi,
  toggleCompleteApi,
  updateTodoApi,
} from "../../api";

// Fetch all todos
export const fetchAllTodos = createAsyncThunk(
  "todo/fetchAllTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllTodosApi();
      return response.data;
    } catch (error) {
      console.error("Error in fetch todos: ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch todos."
      );
    }
  }
);

// Create a new todo
export const createTodo = createAsyncThunk(
  "todo/createTodo",
  async (content, { rejectWithValue }) => {
    try {
      const response = await createTodoApi(content);
      return response.data;
    } catch (error) {
      console.log("Error in create todo: ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to Create todo."
      );
    }
  }
);

// Delete a todo
export const deleteTodo = createAsyncThunk(
  "todo/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteTodoApi(id);
      return response.data;
    } catch (error) {
      console.log("Error in delete todo: ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete todo."
      );
    }
  }
);

// Toggle todo completion status
export const toggleTodo = createAsyncThunk(
  "todo/toggleTodo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await toggleCompleteApi(id);
      return response.data;
    } catch (error) {
      console.log("Error in toggle todo status: ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle todo status."
      );
    }
  }
);

// Update a todo
export const updateTodo = createAsyncThunk(
  "todo/updateTodo",
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await updateTodoApi(id, content);
      return response.data;
    } catch (error) {
      console.log("Error in update todo: ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update todo."
      );
    }
  }
);

const initialState = {
  todos: [],
  isLoading: false,
  error: null,
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  extraReducers: (builder) => {
    builder
      // Fetch all todos.
      .addCase(fetchAllTodos.pending, (state) => {
        state.isLoading = true;
        toast.loading("Fetching Todos...");
      })
      .addCase(fetchAllTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      .addCase(fetchAllTodos.fulfilled, (state, action) => {
        state.todos = action.payload.data;
        state.isLoading = false;
        state.error = null;
        toast.dismiss();
        toast.success("Todos fetched successfully");
      })
      // Create todo.
      .addCase(createTodo.pending, (state) => {
        state.isLoading = true;
        toast.loading("Adding Todo...");
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload.data);
        state.isLoading = false;
        state.error = null;
        toast.dismiss();
        toast.success("Todo added successfully");
      })
      // Delete todo.
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
        toast.loading("Deleting Todo...");
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(
          (todo) => todo._id != action.payload.data._id
        );
        state.isLoading = false;
        state.error = null;
        toast.dismiss();
        toast.success("Todo deleted successfully");
      })
      // Toggle todo.
      .addCase(toggleTodo.pending, (state) => {
        state.isLoading = true;
        toast.loading("Toggling Todo status...");
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        state.todos = state.todos.map((todo) =>
          todo._id == action.payload.data._id
            ? { ...todo, isCompleted: !todo.isCompleted }
            : todo
        );
        state.isLoading = false;
        state.error = null;
        toast.dismiss();
        toast.success("Todo status toggled");
      })
      // Update todo.
      .addCase(updateTodo.pending, (state) => {
        state.isLoading = true;
        toast.loading("Updating Todo...");
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.todos = state.todos.map((todo) =>
          todo._id == action.payload.data._id
            ? { ...todo, content: action.payload.content }
            : todo
        );
        state.isLoading = false;
        state.error = null;
        toast.dismiss();
        toast.success("Todo updated successfully");
      });
  },
});

export default todoSlice.reducer;
