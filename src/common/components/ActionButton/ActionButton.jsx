import PropTypes from "prop-types";

const ActionButton = ({
  text,
  onClick,
  type = "button",
  disabled = false,
  disableOpacity = true,
  backgroundColor = "bg-blue-500",
  hoverBackgroundColor = "hover:bg-blue-600",
  textColor = "text-white",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${backgroundColor}
        ${hoverBackgroundColor}
        ${textColor}
        px-4
        py-2.5
        rounded-lg
        text-base
        font-medium
        transition-colors
        disabled:cursor-not-allowed
        ${disableOpacity ? "disabled:opacity-50" : ""}
        ${className}
      `}
    >
      {text}
    </button>
  );
};

ActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  disableOpacity: PropTypes.bool,
  backgroundColor: PropTypes.string,
  hoverBackgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  className: PropTypes.string,
};

export default ActionButton;
