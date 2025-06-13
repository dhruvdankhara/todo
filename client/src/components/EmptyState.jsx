import { Plus, Filter } from "lucide-react";
import PropTypes from "prop-types";

const EmptyState = ({
  searchTerm,
  filterPriority,
  filterStatus,
  onCreateTodo,
}) => {
  const isFiltered =
    searchTerm || filterPriority !== "all" || filterStatus !== "all";

  return (
    <div className="text-center py-16 sm:py-20">
      <div className="text-gray-400 mb-6">
        {isFiltered ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
              <Filter className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-medium">
                No todos match your filters
              </p>
              <p className="text-sm sm:text-base text-gray-500 mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-medium">No todos yet</p>
              <p className="text-sm sm:text-base text-gray-500 mt-2">
                Create your first todo to get started
              </p>
            </div>
          </div>
        )}
      </div>
      {!isFiltered && (
        <button
          onClick={onCreateTodo}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Create First Todo
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  filterPriority: PropTypes.string.isRequired,
  filterStatus: PropTypes.string.isRequired,
  onCreateTodo: PropTypes.func.isRequired,
};

EmptyState.defaultProps = {};

export default EmptyState;
