import yup from "yup";

import User from "../../model/auth/user.model.js";
import { UserRolesEnum } from "../../constants.js";
import asyncHandler from "../../util/asyncHandler.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { ApiError } from "../../util/ApiError.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const schema = yup.object().shape({
    password: yup.string().min(8).required(),
    email: yup.string().email().required(),
    name: yup.string().required(),
  });

  await schema.validate({ name, email, password });

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new ApiError(409, "user with email already exist.");
  }

  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || UserRolesEnum.USER,
  });

  if (!newUser) {
    throw new ApiError(500, "something went wrong while creating user.");
  }
  const token = newUser.generateAccessToken();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" for cross-origin in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // Ensure cookie is available for all paths
    ...(process.env.NODE_ENV === "production" &&
      process.env.COOKIE_DOMAIN && {
        domain: process.env.COOKIE_DOMAIN,
      }),
  };

  const response = new ApiResponse(201, newUser, "User created successfully");
  return res
    .status(response.statusCode)
    .cookie("token", token, cookieOptions)
    .json(response);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const user = await User.findOne({
    email: email?.toLowerCase(),
  }).select("-__v -createdAt -updatedAt ");

  if (!user) {
    throw new ApiError(404, "User not found. Please register first.");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }
  const token = user.generateAccessToken();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  const response = new ApiResponse(
    200,
    { user, token },
    "user logged in successfully"
  );
  return res
    .status(response.statusCode)
    .cookie("token", token, cookieOptions)
    .json(response);
});

export const getCurrentUser = asyncHandler((req, res) => {
  const response = new ApiResponse(200, req.user, "user get sucessfully.");
  return res.status(response.statusCode).json(response);
});

export const logoutUser = asyncHandler((req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.clearCookie("token", cookieOptions);
  const response = new ApiResponse(200, null, "user logged out successfully.");
  return res.status(response.statusCode).json(response);
});
