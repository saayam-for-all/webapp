import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

const FilterBubbles = ({ activeFilters, onRemoveFilter, onClearAll }) => {
  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2 px-10">
      <button
        onClick={onClearAll}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
      >
        Clear All
        <IoClose size={16} />
      </button>

      {activeFilters.map((filter, index) => (
        <button
          key={`${filter.type}-${filter.value}-${index}`}
          onClick={() => onRemoveFilter(filter.type, filter.value)}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          <span className="text-xs text-gray-600">{filter.type}:</span>
          {filter.value}
          <IoClose size={16} />
        </button>
      ))}
    </div>
  );
};

FilterBubbles.propTypes = {
  activeFilters: PropTypes.array.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

export default FilterBubbles;
