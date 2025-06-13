import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 px-4">
      <div className="text-center">
        <div className="mb-8 rounded-3xl border border-gray-700/30 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 shadow-2xl backdrop-blur-sm">
          <h1 className="bg-gradient-to-br from-gray-600 to-gray-500 bg-clip-text text-9xl font-bold text-transparent">
            404
          </h1>
          <div className="mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-semibold text-transparent">
            Page Not Found
          </div>{" "}
          <p className="mx-auto mb-8 max-w-md text-gray-400">
            Sorry, the page you are looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/todos"
            className="flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-600/40"
          >
            <Home className="h-5 w-5" />
            <span>Go to Todos</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-gray-700 to-gray-800 px-8 py-4 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-gray-600 hover:to-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
