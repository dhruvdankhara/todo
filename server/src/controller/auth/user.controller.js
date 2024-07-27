import yup from "yup";

import User from "../../model/auth/user.model.js";
import { UserRolesEnum } from "../../constants.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { ApiError, handleApiError } from "../../util/errorHandler.js";

const registerUser = async (req, res) => {
  try {
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

    const response = new ApiResponse(201, newUser, "User created successfully");
    return res
      .status(response.statusCode)
      .cookie("token", token)
      .json(response);
  } catch (error) {
    return handleApiError(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
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

    const response = new ApiResponse(
      200,
      { user, token },
      "user logged in successfully"
    );
    return res
      .status(response.statusCode)
      .cookie("token", token)
      .json(response);
  } catch (error) {
    return handleApiError(error, res);
  }
};

const getCurrentUser = (req, res) => {
  const response = new ApiResponse(200, req.user, "user get sucessfully.");
  return res.status(response.statusCode).json(response);
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  const response = new ApiResponse(200, null, "user logged out successfully.");
  return res.status(response.statusCode).json(response);
};

export { registerUser, loginUser, getCurrentUser, logoutUser };
