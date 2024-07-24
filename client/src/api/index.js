import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  timeout: 100000,
});

const fetchAllTodosApi = async () => {
  return await apiClient.get("/todos");
};

const createTodoApi = async (content) => {
  return await apiClient.post("/todos", { content });
};

const deleteTodoApi = async (id) => {
  return await apiClient.delete(`/todos/${id}`);
};

const updateTodoApi = async (id, content) => {
  return await apiClient.post(`/todos/${id}`, { content });
};

const toggleCompleteApi = async (id) => {
  return await apiClient.post(`/todos/status/${id}`);
};

export {
  fetchAllTodosApi,
  createTodoApi,
  deleteTodoApi,
  updateTodoApi,
  toggleCompleteApi,
};
