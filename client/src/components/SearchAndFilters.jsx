import { Search, Grid, List, SortAsc, SortDesc } from "lucide-react";
import { cn } from "../utils/cn";
import PropTypes from "prop-types";

const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  toggleSortOrder,
  layout,
  setLayout,
}) => {
  return (
    <div className="mb-6 space-y-4 sm:mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        <input
          type="text"
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 sm:py-4"
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Todos</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created">Created Date</option>
              <option value="updated">Updated Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="dueDate">Due Date</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="rounded-xl border border-gray-700 bg-gray-800 p-2.5 text-gray-400 transition-all duration-200 hover:bg-gray-700 hover:text-white"
              title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="hidden text-sm text-gray-400 sm:inline">View:</span>
          <button
            onClick={() => setLayout("grid")}
            className={cn(
              "rounded-xl p-2.5 transition-all duration-200",
              layout === "grid"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            )}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setLayout("list")}
            className={cn(
              "rounded-xl p-2.5 transition-all duration-200",
              layout === "list"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            )}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

SearchAndFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filterPriority: PropTypes.string.isRequired,
  setFilterPriority: PropTypes.func.isRequired,
  filterStatus: PropTypes.string.isRequired,
  setFilterStatus: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  toggleSortOrder: PropTypes.func.isRequired,
  layout: PropTypes.string.isRequired,
  setLayout: PropTypes.func.isRequired,
};

export default SearchAndFilters;
