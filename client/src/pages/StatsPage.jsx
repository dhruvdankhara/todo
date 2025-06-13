import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos } from "../store/todosSlice";

import StatsPanel from "../components/StatsPanel";

const StatsPage = () => {
  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  // Calculate additional stats for the header
  const stats = {
    total: todos?.length || 0,
    completed: todos?.filter((todo) => todo.completed)?.length || 0,
    pending: todos?.filter((todo) => !todo.completed)?.length || 0,
    highPriority:
      todos?.filter((todo) => todo.priority === "high")?.length || 0,
    mediumPriority:
      todos?.filter((todo) => todo.priority === "medium")?.length || 0,
    lowPriority: todos?.filter((todo) => todo.priority === "low")?.length || 0,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <>
      {" "}
      {/* Page Header */}
      <div className="mb-8 rounded-3xl border border-gray-700/30 bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-6 shadow-lg backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-bold text-transparent">
              Analytics & Stats
            </h1>
            <p className="mt-2 text-gray-400">
              Track your productivity and progress over time
            </p>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
              {completionRate}%
            </div>
            <div className="text-sm text-gray-400">Completion Rate</div>
          </div>
        </div>{" "}
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 shadow-sm">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"></div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.completed}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 shadow-sm">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-sm"></div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-amber-400">
                  {stats.pending}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 shadow-sm">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm"></div>
              </div>
            </div>
          </div>{" "}
          <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">High Priority</p>
                <p className="text-2xl font-bold text-red-400">
                  {stats.highPriority}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 shadow-sm">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Stats Panel */}
      <StatsPanel />
    </>
  );
};

export default StatsPage;
