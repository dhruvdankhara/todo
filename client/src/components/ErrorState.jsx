import PropTypes from "prop-types";

const ErrorState = ({ error }) => {
  return (
    <div className="mb-6 rounded-xl border border-red-800 bg-red-900/20 p-4">
      <p className="text-center text-red-400">{error}</p>
    </div>
  );
};

ErrorState.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorState;
