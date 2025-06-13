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
    <div className="mb-6 sm:mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="all">All Todos</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="created">Created Date</option>
              <option value="updated">Updated Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="dueDate">Due Date</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700"
              title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            >
              {sortOrder === "asc" ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400 hidden sm:inline">View:</span>
          <button
            onClick={() => setLayout("grid")}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-200",
              layout === "grid"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700"
            )}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout("list")}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-200",
              layout === "list"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700"
            )}
            title="List View"
          >
            <List className="w-4 h-4" />
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
