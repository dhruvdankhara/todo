import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  Calendar,
  Target,
  Activity,
} from "lucide-react";
import { fetchTodoStats } from "../store/todosSlice";
import { cn } from "../utils/cn";

const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-200 hover:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg border", colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{value}</div>
          {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-300">{title}</h3>
    </div>
  );
};

const ProgressRing = ({ progress, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(55 65 81)" // gray-700
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(59 130 246)" // blue-500
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {Math.round(progress)}%
          </div>
          <div className="text-sm text-gray-400">Complete</div>
        </div>
      </div>
    </div>
  );
};

const StatsPanel = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodoStats());
  }, [dispatch]);

  if (loading || !stats) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { todos, subtasks } = stats;
  const overallProgress = todos.total > 0 ? todos.completionRate : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <Activity className="w-6 h-6 text-gray-400" />
      </div>

      {/* Overall Progress */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Overall Progress</h3>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>

        <div className="flex items-center justify-center mb-6">
          <ProgressRing progress={overallProgress} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {todos.completed}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {todos.pending}
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          title="Total Todos"
          value={todos.total}
          subtitle={`${todos.completionRate}% complete`}
          color="blue"
        />

        <StatCard
          icon={CheckCircle2}
          title="Completed Todos"
          value={todos.completed}
          subtitle="Well done!"
          color="green"
        />

        <StatCard
          icon={Circle}
          title="Pending Todos"
          value={todos.pending}
          subtitle="Keep going!"
          color="yellow"
        />

        <StatCard
          icon={Calendar}
          title="Total Subtasks"
          value={subtasks.total}
          subtitle={`${subtasks.completionRate}% complete`}
          color="purple"
        />
      </div>

      {/* Subtasks Breakdown */}
      {subtasks.total > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Subtasks Breakdown
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Completed Subtasks</span>
              <span className="text-green-400 font-semibold">
                {subtasks.completed}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Pending Subtasks</span>
              <span className="text-yellow-400 font-semibold">
                {subtasks.pending}
              </span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${subtasks.completionRate}%`,
                }}
              />
            </div>

            <div className="text-center">
              <span className="text-lg font-semibold text-white">
                {subtasks.completionRate}%
              </span>
              <span className="text-gray-400 ml-2">subtasks completed</span>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-800 rounded-xl p-6">
        <div className="text-center">
          {overallProgress === 100 ? (
            <>
              <h3 className="text-xl font-bold text-white mb-2">
                🎉 Congratulations!
              </h3>
              <p className="text-blue-300">
                You&apos;ve completed all your todos! Time to add some new
                challenges.
              </p>
            </>
          ) : overallProgress >= 75 ? (
            <>
              <h3 className="text-xl font-bold text-white mb-2">
                🚀 Almost There!
              </h3>
              <p className="text-blue-300">
                You&apos;re doing great! Just a few more todos to complete.
              </p>
            </>
          ) : overallProgress >= 50 ? (
            <>
              <h3 className="text-xl font-bold text-white mb-2">
                💪 Keep Going!
              </h3>
              <p className="text-blue-300">
                You&apos;re halfway there! Stay focused and you&apos;ll reach
                your goals.
              </p>
            </>
          ) : overallProgress > 0 ? (
            <>
              <h3 className="text-xl font-bold text-white mb-2">
                🌟 Great Start!
              </h3>
              <p className="text-blue-300">
                Every journey begins with a single step. You&apos;ve got this!
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-white mb-2">
                📝 Ready to Begin?
              </h3>
              <p className="text-blue-300">
                Create your first todo and start your productivity journey!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
