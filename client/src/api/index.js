import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  timeout: 100000,
});

const fetchAllTodos = async () => {
  return await apiClient.get("/todos");
};

const createTodoApi = async (todo) => {
  return await apiClient.post("/todos", { content: todo.content });
};

const deleteTodoApi = async (id) => {
  return await apiClient.delete(`/todos/${id}`);
};

const updateTodoApi = async (id, todo) => {
  return await apiClient.post(`/todos/${id}`, { content: todo.content });
};

const toggleCompleteApi = async (id) => {
  return await apiClient.post(`/todos/status/${id}`);
};

export {
  fetchAllTodos,
  createTodoApi,
  deleteTodoApi,
  updateTodoApi,
  toggleCompleteApi,
};
