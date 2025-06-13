import PropTypes from "prop-types";

const LoadingState = ({ message = "Loading todos..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
      <div className="rounded-3xl border border-gray-700/30 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-4">
          <div className="border-gradient-to-r h-8 w-8 animate-spin rounded-full border-2 border-t-transparent from-blue-500 to-purple-500 shadow-sm"></div>
          <span className="font-medium text-gray-300">{message}</span>
        </div>
      </div>
    </div>
  );
};

LoadingState.propTypes = {
  message: PropTypes.string,
};

LoadingState.defaultProps = {
  message: "Loading todos...",
};

export default LoadingState;
