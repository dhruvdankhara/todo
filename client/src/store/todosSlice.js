import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { todoAPI } from "../services/api";
import toast from "react-hot-toast";

// Async thunks
export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await todoAPI.getAllTodos();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch todos"
      );
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await todoAPI.createTodo(todoData);
      toast.success("Todo created successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create todo");
      return rejectWithValue(
        error.response?.data?.message || "Failed to create todo"
      );
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await todoAPI.updateTodo(id, data);
      toast.success("Todo updated successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update todo");
      return rejectWithValue(
        error.response?.data?.message || "Failed to update todo"
      );
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      await todoAPI.deleteTodo(id);
      toast.success("Todo deleted successfully!");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete todo");
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete todo"
      );
    }
  }
);

export const toggleTodoStatus = createAsyncThunk(
  "todos/toggleTodoStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await todoAPI.toggleTodoStatus(id);
      return response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to toggle todo status"
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle todo status"
      );
    }
  }
);

export const addTodoAttachment = createAsyncThunk(
  "todos/addTodoAttachment",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await todoAPI.addTodoAttachment(id, formData);
      toast.success("Attachment added successfully!");
      return { todoId: id, todo: response.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add attachment");
      return rejectWithValue(
        error.response?.data?.message || "Failed to add attachment"
      );
    }
  }
);

export const removeTodoAttachment = createAsyncThunk(
  "todos/removeTodoAttachment",
  async ({ todoId, attachmentId }, { rejectWithValue }) => {
    try {
      const response = await todoAPI.removeTodoAttachment(todoId, attachmentId);
      toast.success("Attachment removed successfully!");
      return { todoId, todo: response.data.data };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove attachment"
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove attachment"
      );
    }
  }
);

export const addTodoLink = createAsyncThunk(
  "todos/addTodoLink",
  async ({ id, linkData }, { rejectWithValue }) => {
    try {
      const response = await todoAPI.addTodoLink(id, linkData);
      toast.success("Link added successfully!");
      return { todoId: id, todo: response.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add link");
      return rejectWithValue(
        error.response?.data?.message || "Failed to add link"
      );
    }
  }
);

export const removeTodoLink = createAsyncThunk(
  "todos/removeTodoLink",
  async ({ todoId, linkId }, { rejectWithValue }) => {
    try {
      const response = await todoAPI.removeTodoLink(todoId, linkId);
      toast.success("Link removed successfully!");
      return { todoId, todo: response.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove link");
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove link"
      );
    }
  }
);

// Subtask async thunks
export const addSubtask = createAsyncThunk(
  "todos/addSubtask",
  async ({ todoId, content }, { rejectWithValue }) => {
    try {
      const response = await todoAPI.createSubTask(todoId, { content });
      toast.success("Subtask added successfully!");
      return { todoId, todo: response.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add subtask");
      return rejectWithValue(
        error.response?.data?.message || "Failed to add subtask"
      );
    }
  }
);

export const toggleSubtaskStatus = createAsyncThunk(
  "todos/toggleSubtaskStatus",
  async ({ todoId, subtaskId }, { rejectWithValue }) => {
    try {
      const response = await todoAPI.toggleSubTaskStatus(todoId, subtaskId);
      return { todoId, todo: response.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update subtask");
      return rejectWithValue(
        error.response?.data?.message || "Failed to update subtask"
      );
    }
  }
);

export const deleteSubtask = createAsyncThunk(
  "todos/deleteSubtask",
  async ({ todoId, subtaskId }, { rejectWithValue }) => {
    try {
      const response = await todoAPI.deleteSubTask(todoId, subtaskId);
      toast.success("Subtask deleted successfully!");
      return { todoId, todo: response.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete subtask");
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete subtask"
      );
    }
  }
);

export const fetchTodoStats = createAsyncThunk(
  "todos/fetchTodoStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await todoAPI.getTodoStats();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

const initialState = {
  todos: [],
  stats: null,
  loading: false,
  error: null,
  selectedTodo: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setSelectedTodo: (state, action) => {
      state.selectedTodo = action.payload;
    },
    clearSelectedTodo: (state) => {
      state.selectedTodo = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create todo
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.unshift(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload._id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        if (state.selectedTodo?._id === action.payload._id) {
          state.selectedTodo = action.payload;
        }
      })

      // Delete todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
        if (state.selectedTodo?._id === action.payload) {
          state.selectedTodo = null;
        }
      })

      // Toggle todo status
      .addCase(toggleTodoStatus.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload._id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        if (state.selectedTodo?._id === action.payload._id) {
          state.selectedTodo = action.payload;
        }
      })

      // Add/remove attachments and links
      .addCase(addTodoAttachment.fulfilled, (state, action) => {
        const { todoId, todo } = action.payload;
        const index = state.todos.findIndex((t) => t._id === todoId);
        if (index !== -1) {
          state.todos[index] = todo;
        }
        if (state.selectedTodo?._id === todoId) {
          state.selectedTodo = todo;
        }
      })
      .addCase(removeTodoAttachment.fulfilled, (state, action) => {
        const { todoId, todo } = action.payload;
        const index = state.todos.findIndex((t) => t._id === todoId);
        if (index !== -1) {
          state.todos[index] = todo;
        }
        if (state.selectedTodo?._id === todoId) {
          state.selectedTodo = todo;
        }
      })
      .addCase(addTodoLink.fulfilled, (state, action) => {
        const { todoId, todo } = action.payload;
        const index = state.todos.findIndex((t) => t._id === todoId);
        if (index !== -1) {
          state.todos[index] = todo;
        }
        if (state.selectedTodo?._id === todoId) {
          state.selectedTodo = todo;
        }
      })
      .addCase(removeTodoLink.fulfilled, (state, action) => {
        const { todoId, todo } = action.payload;
        const index = state.todos.findIndex((t) => t._id === todoId);
        if (index !== -1) {
          state.todos[index] = todo;
        }
        if (state.selectedTodo?._id === todoId) {
          state.selectedTodo = todo;
        }
      })

      // Subtask actions
      .addCase(addSubtask.fulfilled, (state, action) => {
        const { todoId, todo } = action.payload;
        const index = state.todos.findIndex((t) => t._id === todoId);
        if (index !== -1) {
          state.todos[index] = todo;
        }
        if (state.selectedTodo?._id === todoId) {
          state.selectedTodo = todo;
        }
      })
      .addCase(toggleSubtaskStatus.fulfilled, (state, action) => {
        const { todoId, todo } = action.payload;
        const index = state.todos.findIndex((t) => t._id === todoId);
        if (index !== -1) {
          state.todos[index] = todo;
        }
        if (state.selectedTodo?._id === todoId) {
          state.selectedTodo = todo;
        }
      })
      .addCase(deleteSubtask.fulfilled, (state, action) => {
        const { todoId, todo } = action.payload;
        const index = state.todos.findIndex((t) => t._id === todoId);
        if (index !== -1) {
          state.todos[index] = todo;
        }
        if (state.selectedTodo?._id === todoId) {
          state.selectedTodo = todo;
        }
      })

      // Fetch stats
      .addCase(fetchTodoStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setSelectedTodo, clearSelectedTodo, clearError } =
  todosSlice.actions;
export default todosSlice.reducer;
