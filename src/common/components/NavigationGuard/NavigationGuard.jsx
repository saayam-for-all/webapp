import { useEffect, useState, useCallback } from "react";
import { useBeforeUnload, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NavigationGuard() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastPath, setLastPath] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  useEffect(() => {
    window._hasUnsavedChanges = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  const checkNavigation = useCallback(
    (to, callback) => {
      if (hasUnsavedChanges) {
        const confirmMessage = t(
          "UNSAVED_CHANGES_WARNING",
          "You have unsaved changes. Do you want to proceed without saving?",
        );

        if (window.confirm(confirmMessage)) {
          setHasUnsavedChanges(false);
          const event = new CustomEvent("unsaved-changes", {
            detail: { hasUnsavedChanges: false },
          });
          window.dispatchEvent(event);

          if (callback) {
            callback();
          } else if (to) {
            navigate(to);
          }
          return true;
        }
        return false;
      }
      if (callback) {
        callback();
      } else if (to) {
        navigate(to);
      }
      return true;
    },
    [hasUnsavedChanges, navigate, t],
  );

  useEffect(() => {
    window._checkNavigation = checkNavigation;
  }, [checkNavigation]);

  useEffect(() => {
    setLastPath(location.pathname);
  }, [location]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (hasUnsavedChanges) {
        const confirmMessage = t(
          "UNSAVED_CHANGES_WARNING",
          "You have unsaved changes. Do you want to proceed without saving?",
        );

        const shouldProceed = window.confirm(confirmMessage);

        if (!shouldProceed) {
          event.preventDefault();
          window.history.pushState(null, "", lastPath);
        } else {
          setHasUnsavedChanges(false);
          const resetEvent = new CustomEvent("unsaved-changes", {
            detail: { hasUnsavedChanges: false },
          });
          window.dispatchEvent(resetEvent);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, lastPath, t]);

  return null;
}

export default NavigationGuard;
