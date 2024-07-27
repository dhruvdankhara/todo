import jwt from "jsonwebtoken";

import { ApiError, handleApiError } from "../util/errorHandler.js";
import User from "../model/auth/user.model.js";

/**
 * Middleware function to verify JWT token and authenticate the user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the middleware is complete.
 * @throws {ApiError} - If the token is missing, invalid, or the user is not found.
 */
export const verifyJWT = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenData) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(tokenData._id).select(
      "-password -__v -createdAt -updatedAt"
    );
    if (!user) {
      throw new ApiError(401, "Unauthorized, User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    return handleApiError(error, res);
  }
};
