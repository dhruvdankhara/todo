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
    <div className="py-16 text-center sm:py-20">
      <div className="mb-6 text-gray-400">
        {isFiltered ? (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
              <Filter className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-medium sm:text-xl">
                No todos match your filters
              </p>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-lg font-medium sm:text-xl">No todos yet</p>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Create your first todo to get started
              </p>
            </div>
          </div>
        )}
      </div>
      {!isFiltered && (
        <button
          onClick={onCreateTodo}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-600/40"
        >
          <Plus className="mr-2 inline h-4 w-4" />
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
