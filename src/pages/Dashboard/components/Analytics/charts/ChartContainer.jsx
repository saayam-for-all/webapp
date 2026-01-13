import PropTypes from "prop-types";

/**
 * ChartContainer - Reusable wrapper for all analytics charts
 * Provides consistent styling and structure
 */
const ChartContainer = ({ title, description, children, className = "" }) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm ${className}`}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
};

ChartContainer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default ChartContainer;
