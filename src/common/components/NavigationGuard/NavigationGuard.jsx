import { useEffect, useState } from "react";
import { useBeforeUnload, useLocation } from "react-router-dom";

function NavigationGuard() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const location = useLocation();

  // Listen for custom event from Profile components indicating unsaved changes
  useEffect(() => {
    const handleUnsavedChanges = (event) => {
      setHasUnsavedChanges(event.detail.hasUnsavedChanges);
    };

    window.addEventListener("unsaved-changes", handleUnsavedChanges);

    return () => {
      window.removeEventListener("unsaved-changes", handleUnsavedChanges);
    };
  }, []);

  // Show browser warning when user tries to close tab/window with unsaved changes
  useBeforeUnload(
    (event) => {
      if (hasUnsavedChanges) {
        // Standard message will be shown by the browser
        event.preventDefault();
        return "";
      }
    },
    [hasUnsavedChanges],
  );

  // We don't need to render anything, this is just a behavior component
  return null;
}

export default NavigationGuard;
