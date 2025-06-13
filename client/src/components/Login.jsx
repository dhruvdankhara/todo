import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn } from "lucide-react";
import { login, clearError } from "../store/authSlice";
import { cn } from "../utils/cn";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/todos", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(clearError());

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      await dispatch(login(formData)).unwrap();
      navigate("/todos", { replace: true });
    } catch (error) {
      // Error is handled in the slice
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 shadow-lg shadow-blue-600/25">
              <LogIn className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to your account to continue
          </p>
        </div>
        <div className="rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {" "}
            {error && (
              <div className="rounded-2xl border border-red-800 bg-red-900/20 p-3">
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email address
              </label>{" "}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "w-full rounded-2xl border bg-gray-700/90 py-4 pl-12 pr-4 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    formErrors.email
                      ? "border-red-500/70"
                      : "border-gray-600/70"
                  )}
                  placeholder="Enter your email"
                />
              </div>
              {formErrors.email && (
                <div className="mt-1 flex items-center text-sm text-red-400">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  {formErrors.email}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>{" "}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    "w-full rounded-2xl border bg-gray-700/90 py-4 pl-12 pr-14 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    formErrors.password ? "border-red-500" : "border-gray-600"
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full p-1 text-gray-400 transition-all duration-200 hover:bg-gray-600/50 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <div className="mt-1 flex items-center text-sm text-red-400">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  {formErrors.password}
                </div>
              )}
            </div>{" "}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-600/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign in
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>{" "}
        <div className="rounded-2xl border border-blue-800 bg-blue-900/20 p-4">
          <h3 className="mb-2 text-sm font-medium text-blue-300">
            Demo Credentials
          </h3>
          <div className="space-y-1 text-xs text-blue-200">
            <p>Email: demo@example.com</p>
            <p>Password: demo1234</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
