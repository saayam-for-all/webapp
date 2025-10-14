import React, { createContext, useContext, useState, useEffect } from "react";

const UnsavedChangesContext = createContext();

export const UnsavedChangesProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reset unsaved changes state on form reset/submit events
  useEffect(() => {
    const handleGlobalReset = () => {
      setHasUnsavedChanges(false);
    };

    const handleGlobalSubmit = () => {
      setHasUnsavedChanges(false);
    };

    document.addEventListener("profile-form-reset", handleGlobalReset);
    document.addEventListener("profile-form-submit", handleGlobalSubmit);

    return () => {
      document.removeEventListener("profile-form-reset", handleGlobalReset);
      document.removeEventListener("profile-form-submit", handleGlobalSubmit);
    };
  }, []);

  return (
    <UnsavedChangesContext.Provider
      value={{ hasUnsavedChanges, setHasUnsavedChanges }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => useContext(UnsavedChangesContext);
