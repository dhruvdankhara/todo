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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-400 mt-6 text-lg">Initializing...</p>
          <p className="text-gray-500 mt-2 text-sm">
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
