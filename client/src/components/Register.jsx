import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { register, clearError } from "../store/authSlice";
import { cn } from "../utils/cn";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error
    dispatch(clearError());

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const result = await dispatch(
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );

    if (register.fulfilled.match(result)) {
      navigate("/login");
    }
  };
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 shadow-lg shadow-blue-600/25">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 px-6 py-10 shadow-2xl backdrop-blur-sm sm:rounded-3xl sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Global Error */}
            {error && (
              <div className="flex items-start space-x-2 rounded-2xl border border-red-700/50 bg-red-900/20 p-4 backdrop-blur-sm">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Full Name
              </label>{" "}
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={cn(
                    "block w-full rounded-2xl border bg-gray-700/90 py-3 pl-12 pr-4 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    formErrors.name
                      ? "border-red-500/70 focus:ring-red-500"
                      : "border-gray-600/70"
                  )}
                  placeholder="Enter your full name"
                />
              </div>
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>{" "}
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "block w-full rounded-2xl border bg-gray-700/90 py-3 pl-12 pr-4 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    formErrors.email
                      ? "border-red-500/70 focus:ring-red-500"
                      : "border-gray-600/70"
                  )}
                  placeholder="Enter your email"
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>{" "}
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    "block w-full rounded-2xl border bg-gray-700/90 py-3 pl-12 pr-14 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    formErrors.password
                      ? "border-red-500/70 focus:ring-red-500"
                      : "border-gray-600/70"
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 z-10 flex items-center pr-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <div className="rounded-full p-1 transition-all duration-200 hover:bg-gray-600/50">
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </div>
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>{" "}
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cn(
                    "block w-full rounded-2xl border bg-gray-700/90 py-3 pl-12 pr-14 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    formErrors.confirmPassword
                      ? "border-red-500/70 focus:ring-red-500"
                      : "border-gray-600/70"
                  )}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 z-10 flex items-center pr-4"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <div className="rounded-full p-1 transition-all duration-200 hover:bg-gray-600/50">
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </div>
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              {" "}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "flex w-full justify-center rounded-2xl border border-transparent px-6 py-4 text-sm font-medium text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800",
                  loading
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 shadow-blue-600/25 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-600/40"
                )}
              >
                {loading ? (
                  <>
                    <svg
                      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
