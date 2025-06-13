import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Floating Navbar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Left Section  */}
              <div className="flex items-center space-x-2 sm:space-x-6">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-white hidden sm:block">
                    TodoApp
                  </h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                  <button
                    onClick={() => setView("todos")}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      view === "todos"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    )}
                  >
                    <List className="w-4 h-4 inline mr-2" />
                    Todos
                  </button>
                  <button
                    onClick={() => setView("stats")}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      view === "stats"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    )}
                  >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
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
                    className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden lg:inline">New Todo</span>
                  </button>
                )}

                {/* User Info - Desktop */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium hidden lg:inline">
                      {user?.name || "User"}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-xl transition-all duration-200 hover:bg-gray-700/50"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm hidden lg:inline">Logout</span>
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
                >
                  {showMobileMenu ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-700/50 bg-gray-800/95 backdrop-blur-xl rounded-b-2xl">
              <div className="px-4 py-3 space-y-2">
                {/* Mobile  */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setView("todos");
                      setShowMobileMenu(false);
                    }}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      view === "todos"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    )}
                  >
                    <List className="w-5 h-5" />
                    <span>Todos</span>
                  </button>

                  <button
                    onClick={() => {
                      setView("stats");
                      setShowMobileMenu(false);
                    }}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      view === "stats"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    )}
                  >
                    <BarChart3 className="w-5 h-5" />
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
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Todo</span>
                  </button>
                )}

                {/* Mobile User Section */}
                <div className="pt-2 border-t border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
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
                      className="flex items-center space-x-2 text-gray-300 hover:text-red-400 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-gray-700/50"
                    >
                      <LogOut className="w-4 h-4" />
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

export default FloatingNavbar;
