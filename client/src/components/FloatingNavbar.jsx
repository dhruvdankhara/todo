import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Plus,
  BarChart3,
  List,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { logout } from "../store/authSlice";
import { cn } from "../utils/cn";

const FloatingNavbar = ({
  onCreateTodo,
  showMobileMenu,
  setShowMobileMenu,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { todos } = useSelector((state) => state.todos);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Get current view from location
  const currentView = location.pathname === "/stats" ? "stats" : "todos";

  // Calculate stats for display
  const todoStats = {
    total: todos?.length || 0,
    completed: todos?.filter((todo) => todo.completed)?.length || 0,
    pending: todos?.filter((todo) => !todo.completed)?.length || 0,
  };

  // Handle logout with loading state
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, navigate]);

  // Close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowMobileMenu]);

  const navItems = [
    {
      id: "todos",
      label: "Todos",
      icon: List,
      path: "/todos",
    },
    {
      id: "stats",
      label: "Analytics",
      icon: BarChart3,
      path: "/stats",
    },
  ];

  return (
    <>
      {/* Mobile menu overlay with improved animation */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          showMobileMenu ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setShowMobileMenu(false)}
        aria-hidden="true"
      />

      {/* Floating Navbar with enhanced styling */}
      <nav
        className="fixed left-1/2 top-4 z-50 w-[95%] max-w-6xl -translate-x-1/2 transform"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="rounded-3xl border border-gray-700/50 bg-gray-800/90 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:border-gray-600/50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between sm:h-16">
              {/* Left Section */}
              <div className="flex items-center space-x-2 sm:space-x-6">
                {/* Logo */}
                <NavLink to="/todos" className="flex items-center space-x-2">
                  <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
                    Not Just Todos
                  </h1>
                </NavLink>

                {/* Enhanced Desktop Navigation */}
                <div className="hidden items-center space-x-1 md:flex">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive: routeIsActive }) =>
                          cn(
                            "relative rounded-3xl px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                            routeIsActive || isActive
                              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                              : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          )
                        }
                      >
                        <Icon className="mr-2 inline h-4 w-4" />
                        {item.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {" "}
                {currentView === "todos" && (
                  <button
                    onClick={onCreateTodo}
                    className="flex items-center space-x-2 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white shadow-sm shadow-blue-600/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-600/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    aria-label="Create new todo"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden lg:inline">New Todo</span>
                  </button>
                )}
                <div className="hidden md:block" ref={dropdownRef}>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center space-x-3 rounded-3xl px-3 py-2 text-gray-300 transition-all duration-200 hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      aria-expanded={showUserDropdown}
                      aria-haspopup="true"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700 ring-2 ring-gray-600/50">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="hidden text-sm font-medium lg:inline">
                          {user?.name || "User"}
                        </span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          showUserDropdown && "rotate-180"
                        )}
                      />
                    </button>

                    {showUserDropdown && (
                      <div className="absolute right-0 top-12 w-72 rounded-3xl border border-gray-700/50 bg-gray-800/95 shadow-2xl backdrop-blur-xl">
                        <div className="p-4">
                          <div className="flex items-center space-x-3 border-b border-gray-700/50 pb-3">
                            <div className="flex aspect-square h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700">
                              <User className="aspect-square h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {user?.name || "User"}
                              </p>
                              <p className="truncate text-sm text-gray-400">
                                {user?.email || ""}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2 border-b border-gray-700/50 pb-3">
                            <div className="text-center">
                              <p className="text-lg font-bold text-blue-400">
                                {todoStats.total}
                              </p>
                              <p className="text-xs text-gray-400">Total</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-green-400">
                                {todoStats.completed}
                              </p>
                              <p className="text-xs text-gray-400">Done</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-amber-400">
                                {todoStats.pending}
                              </p>
                              <p className="text-xs text-gray-400">Pending</p>
                            </div>
                          </div>

                          <div className="mt-3 space-y-1">
                            <button
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className="flex w-full items-center space-x-3 rounded-3xl px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                            >
                              {isLoggingOut ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <LogOut className="h-4 w-4" />
                              )}
                              <span>
                                {isLoggingOut ? "Signing out..." : "Sign out"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="rounded-xl p-2 text-gray-300 transition-all duration-200 hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 md:hidden"
                  aria-expanded={showMobileMenu}
                  aria-label="Toggle mobile menu"
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

          {/*  Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className={cn(
              "overflow-hidden transition-all duration-300 md:hidden",
              showMobileMenu
                ? "max-h-96 border-t border-gray-700/50"
                : "max-h-0"
            )}
          >
            <div className="rounded-b-2xl bg-gray-800/95 backdrop-blur-xl">
              <div className="space-y-2 px-4 py-3">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setShowMobileMenu(false)}
                        className={({ isActive: routeIsActive }) =>
                          cn(
                            "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                            routeIsActive || isActive
                              ? "bg-blue-600 text-white"
                              : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          )
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>

                {currentView === "todos" && (
                  <button
                    onClick={() => {
                      onCreateTodo();
                      setShowMobileMenu(false);
                    }}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white shadow-sm shadow-blue-600/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Plus className="h-5 w-5" />
                    <span>New Todo</span>
                  </button>
                )}

                {/*  Stats */}
                <div className="border-t border-gray-700/50 pt-3">
                  <div className="mb-3 grid grid-cols-3 gap-2 rounded-xl bg-gray-700/30 p-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-400">
                        {todoStats.total}
                      </p>
                      <p className="text-xs text-gray-400">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-400">
                        {todoStats.completed}
                      </p>
                      <p className="text-xs text-gray-400">Done</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-400">
                        {todoStats.pending}
                      </p>
                      <p className="text-xs text-gray-400">Pending</p>
                    </div>
                  </div>

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
                      disabled={isLoggingOut}
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-gray-300 transition-all duration-200 hover:bg-gray-700/50 hover:text-red-400 disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      <span className="text-sm">
                        {isLoggingOut ? "Signing out..." : "Sign out"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

FloatingNavbar.propTypes = {
  onCreateTodo: PropTypes.func.isRequired,
  showMobileMenu: PropTypes.bool.isRequired,
  setShowMobileMenu: PropTypes.func.isRequired,
};

export default FloatingNavbar;
