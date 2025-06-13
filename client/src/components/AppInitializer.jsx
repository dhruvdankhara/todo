import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { getCurrentUser } from "../store/authSlice";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { hasAttemptedAuth, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = () => {
      const isAuthPage =
        location.pathname === "/login" || location.pathname === "/register";

      if (!hasAttemptedAuth && !isAuthPage) {
        dispatch(getCurrentUser());
      }
    };

    initializeAuth();
  }, [dispatch, hasAttemptedAuth, location.pathname, loading]);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (!hasAttemptedAuth && loading && !isAuthPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-6 text-lg text-gray-400">Initializing...</p>
          <p className="mt-2 text-sm text-gray-500">
            Checking authentication status
          </p>
        </div>
      </div>
    );
  }

  return children;
};

AppInitializer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppInitializer;
