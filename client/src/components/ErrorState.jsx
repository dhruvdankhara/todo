import PropTypes from "prop-types";

const ErrorState = ({ error }) => {
  return (
    <div className="mb-6 rounded-3xl border border-red-800/50 bg-gradient-to-br from-red-900/20 to-red-800/20 p-6 shadow-lg backdrop-blur-sm">
      <p className="text-center font-medium text-red-400">{error}</p>
    </div>
  );
};

ErrorState.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorState;
