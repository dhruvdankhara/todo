import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { registerUserApi, loginUserApi, logoutUserApi } from "../../api";
import { setLoadingState, setErrorState } from "./authUtils";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(name, email, password);
      return response.data;
    } catch (error) {
      console.error("Error in user register: ", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(email, password);
      return response.data;
    } catch (error) {
      console.error("Error in user login: ", error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutUserApi();
      return response.data;
    } catch (error) {
      console.error("Error in user logout: ", error);
      const errorMessage =
        error.response?.data?.message || "Logout failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  isLoading: false,
  isLogged: false,
  user: {},
  error: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    // register user
    builder
      .addCase(registerUser.pending, (state) => {
        setLoadingState(state, "registering user...");
      })
      .addCase(registerUser.rejected, (state, action) => {
        setErrorState(state, action);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogged = true;
        state.error = "";
        state.user = action.payload.data;
        toast.dismiss();
        toast.success(
          action.payload.message || "User registered successfully."
        );
      });
    // login user
    builder
      .addCase(loginUser.pending, (state) => {
        setLoadingState(state, "login user...");
      })
      .addCase(loginUser.rejected, (state, action) => {
        setErrorState(state, action);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogged = true;
        state.error = "";
        state.user = action.payload.data.user;
        toast.dismiss();
        toast.success(action.payload.message || "User logged in successfully.");
      });
    // logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        setLoadingState(state, "loging out user...");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        setErrorState(state, action);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isLogged = false;
        state.error = "";
        state.user = {};
        toast.dismiss();
        toast.success("User logged out successfully.");
      });
  },
});

export default authSlice.reducer;
