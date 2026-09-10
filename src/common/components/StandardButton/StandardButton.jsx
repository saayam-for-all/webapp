import PropTypes from "prop-types";

const StandardButton = ({
  text,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  const variantClasses = {
    primary: "bg-[#4A7DF0] hover:bg-[#3E71E3] active:bg-[#3766D4]",
    secondary: "bg-[#6B7280] hover:bg-[#5F6673] active:bg-[#565D69]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
       h-10
       min-w-[74px]
       px-5
       rounded-md
     text-white
       text-sm
       font-medium
       transition-colors
       duration-200
       ${variantClasses[variant]}
       ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
       ${className}
    `}
    >
      {text}
    </button>
  );
};

StandardButton.propTypes = {
  text: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary"]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default StandardButton;
