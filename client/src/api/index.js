import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  timeout: 100000,
});

const registerUserApi = async (name, email, password) => {
  return await apiClient.post("/user/register", { name, email, password });
};

const loginUserApi = async (email, password) => {
  return await apiClient.post("/user/login", { email, password });
};

const logoutUserApi = async () => {
  return await apiClient.post("/user/logout");
};

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
  registerUserApi,
  loginUserApi,
  logoutUserApi,
  fetchAllTodosApi,
  createTodoApi,
  deleteTodoApi,
  updateTodoApi,
  toggleCompleteApi,
};
