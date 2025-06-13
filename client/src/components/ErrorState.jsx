import PropTypes from "prop-types";

const ErrorState = ({ error }) => {
  return (
    <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6">
      <p className="text-red-400 text-center">{error}</p>
    </div>
  );
};

ErrorState.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorState;
