import React from "react";
import PropTypes from "prop-types";

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="bg-gray-100 p-6 rounded-full mb-6">
      <Icon className="text-gray-400 text-4xl" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-center max-w-md">{description}</p>
  </div>
);

EmptyState.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default EmptyState;
