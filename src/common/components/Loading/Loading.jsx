import React from "react";
import defaultSpinner from "../../../assets/loading.gif"; // Adjust path as needed

const LoadingIndicator = ({
  src = defaultSpinner,
  alt = "Loading...",
  size = "50px",
  position = "beside", // "beside" by default
  customStyles = {}, // Custom styles to pass when needed
}) => {
  const containerStyles =
    position === "center"
      ? "flex items-center justify-center min-h-screen"
      : "flex items-center"; // Ensure inline display for beside

  return (
    <div className={`${containerStyles} ${customStyles.container}`}>
      <img
        src={src}
        alt={alt}
        style={{ width: size, height: size }}
        className={`animate-pulse ${customStyles.image}`}
      />
    </div>
  );
};

export default LoadingIndicator;
