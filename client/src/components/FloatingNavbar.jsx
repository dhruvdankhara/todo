import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Plus, BarChart3, List, LogOut, User, Menu, X } from "lucide-react";
import { logout } from "../store/authSlice";
import { cn } from "../utils/cn";

const FloatingNavbar = ({
  view,
  setView,
  onCreateTodo,
  showMobileMenu,
  setShowMobileMenu,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile menu overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Floating Navbar */}
      <nav className="fixed left-1/2 top-4 z-50 w-[95%] max-w-6xl -translate-x-1/2 transform">
        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/90 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between sm:h-16">
              {/* Left Section  */}
              <div className="flex items-center space-x-2 sm:space-x-6">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-sm font-bold text-white">T</span>
                  </div>
                  <h1 className="hidden text-lg font-bold text-white sm:block sm:text-xl">
                    TodoApp
                  </h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden items-center space-x-1 md:flex">
                  <button
                    onClick={() => setView("todos")}
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                      view === "todos"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    )}
                  >
                    <List className="mr-2 inline h-4 w-4" />
                    Todos
                  </button>
                  <button
                    onClick={() => setView("stats")}
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                      view === "stats"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    )}
                  >
                    <BarChart3 className="mr-2 inline h-4 w-4" />
                    Stats
                  </button>
                </div>
              </div>

              {/* Right Section - Actions & User */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Create Todo Button - Desktop */}
                {view === "todos" && (
                  <button
                    onClick={onCreateTodo}
                    className="hidden items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-600/40 sm:flex"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden lg:inline">New Todo</span>
                  </button>
                )}

                {/* User Info - Desktop */}
                <div className="hidden items-center space-x-3 md:flex">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="hidden text-sm font-medium lg:inline">
                      {user?.name || "User"}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 rounded-xl px-3 py-2 text-gray-300 transition-all duration-200 hover:bg-gray-700/50 hover:text-white"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden text-sm lg:inline">Logout</span>
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="rounded-xl p-2 text-gray-300 transition-all duration-200 hover:bg-gray-700/50 hover:text-white md:hidden"
                >
                  {showMobileMenu ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="rounded-b-2xl border-t border-gray-700/50 bg-gray-800/95 backdrop-blur-xl md:hidden">
              <div className="space-y-2 px-4 py-3">
                {/* Mobile  */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setView("todos");
                      setShowMobileMenu(false);
                    }}
                    className={cn(
                      "flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      view === "todos"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    )}
                  >
                    <List className="h-5 w-5" />
                    <span>Todos</span>
                  </button>

                  <button
                    onClick={() => {
                      setView("stats");
                      setShowMobileMenu(false);
                    }}
                    className={cn(
                      "flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      view === "stats"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    )}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Stats</span>
                  </button>
                </div>

                {/* Mobile Create Todo Button */}
                {view === "todos" && (
                  <button
                    onClick={() => {
                      onCreateTodo();
                      setShowMobileMenu(false);
                    }}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white shadow-lg shadow-blue-600/25 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    <span>New Todo</span>
                  </button>
                )}

                {/* Mobile User Section */}
                <div className="border-t border-gray-700/50 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-gray-300 transition-all duration-200 hover:bg-gray-700/50 hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

FloatingNavbar.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  onCreateTodo: PropTypes.func.isRequired,
  showMobileMenu: PropTypes.bool.isRequired,
  setShowMobileMenu: PropTypes.func.isRequired,
};

export default FloatingNavbar;
