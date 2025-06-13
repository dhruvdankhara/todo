import PropTypes from "prop-types";

const LoadingState = ({ message = "Loading todos..." }) => {
  return (
    <div className="flex items-center justify-center py-16 sm:py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      <span className="ml-3 text-gray-400">{message}</span>
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
