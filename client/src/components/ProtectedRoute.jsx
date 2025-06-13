import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { getCurrentUser } from "../store/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, isAuthenticated, hasAttemptedAuth } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (!hasAttemptedAuth && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, hasAttemptedAuth, loading, isAuthenticated]);

  if (loading || !hasAttemptedAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after attempting, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // User is authenticated, render the protected content
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
