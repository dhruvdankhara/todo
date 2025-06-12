import axios from "axios";
import store from "../store"; // Import the store
import { resetAuth } from "../store/authSlice"; // Import the reset action

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - remove auth header since we use cookies
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(resetAuth());

      // Only redirect to login if we're not already on login/register pages
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Todo API
export const todoAPI = {
  // Basic CRUD
  getAllTodos: () => api.get("/todos"),
  getTodoById: (id) => api.get(`/todos/${id}`),
  createTodo: (data) => api.post("/todos", data),
  updateTodo: (id, data) => api.put(`/todos/${id}`, data),
  deleteTodo: (id) => api.delete(`/todos/${id}`),
  toggleTodoStatus: (id) => api.patch(`/todos/${id}/status`),

  // Statistics
  getTodoStats: () => api.get("/todos/stats"),

  // Attachments
  addTodoAttachment: (id, formData) => {
    return api.post(`/todos/${id}/attachments`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  removeTodoAttachment: (todoId, attachmentId) =>
    api.delete(`/todos/${todoId}/attachments/${attachmentId}`),

  // Links
  addTodoLink: (id, data) => api.post(`/todos/${id}/links`, data),
  removeTodoLink: (todoId, linkId) =>
    api.delete(`/todos/${todoId}/links/${linkId}`),

  // Subtasks
  getSubTasks: (todoId) => api.get(`/todos/${todoId}/subtasks`),
  createSubTask: (todoId, data) => api.post(`/todos/${todoId}/subtasks`, data),
  updateSubTask: (todoId, subtaskId, data) =>
    api.put(`/todos/${todoId}/subtasks/${subtaskId}`, data),
  deleteSubTask: (todoId, subtaskId) =>
    api.delete(`/todos/${todoId}/subtasks/${subtaskId}`),
  toggleSubTaskStatus: (todoId, subtaskId) =>
    api.patch(`/todos/${todoId}/subtasks/${subtaskId}/status`),

  // Subtask attachments
  addSubTaskAttachment: (todoId, subtaskId, formData) => {
    return api.post(
      `/todos/${todoId}/subtasks/${subtaskId}/attachments`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },
  removeSubTaskAttachment: (todoId, subtaskId, attachmentId) =>
    api.delete(
      `/todos/${todoId}/subtasks/${subtaskId}/attachments/${attachmentId}`
    ),

  // Subtask links
  addSubTaskLink: (todoId, subtaskId, data) =>
    api.post(`/todos/${todoId}/subtasks/${subtaskId}/links`, data),
  removeSubTaskLink: (todoId, subtaskId, linkId) =>
    api.delete(`/todos/${todoId}/subtasks/${subtaskId}/links/${linkId}`),
};

// Auth API
export const authAPI = {
  login: (data) => api.post("/user/login", data),
  register: (data) => api.post("/user/register", data),
  logout: () => api.post("/user/logout"),
  getCurrentUser: () => api.get("/user/current-user"),
};

export default api;
