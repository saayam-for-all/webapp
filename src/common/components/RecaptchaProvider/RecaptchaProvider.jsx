import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import "./RecaptchaProvider.css";

export const RECAPTCHA_BADGE_ID = "recaptcha-badge";

// Wraps the whole app so reCAPTCHA v3 can score behavior across every page.
// Keep the container outside route content so navigation cannot remove the widget.
const RecaptchaProvider = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const updateReady = () =>
      setReady(Boolean(container.querySelector(".grecaptcha-badge")));
    const observer = new MutationObserver(updateReady);
    observer.observe(container, { childList: true, subtree: true });
    updateReady();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const collapse = () => setExpanded(false);
    const handlePointerDown = (event) => {
      if (!wrapperRef.current.contains(event.target)) collapse();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") collapse();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", collapse, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", collapse);
    };
  }, [expanded]);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      container={{
        element: RECAPTCHA_BADGE_ID,
        parameters: { badge: "bottomleft" },
      }}
      scriptProps={{ async: true, defer: true }}
    >
      {children}
      <div
        ref={wrapperRef}
        className={`recaptcha-badge-container${expanded ? " is-expanded" : ""}`}
      >
        <div id={RECAPTCHA_BADGE_ID} ref={containerRef} />
        {ready && (
          <button
            type="button"
            className="recaptcha-badge-toggle"
            aria-label={`${expanded ? "Collapse" : "Expand"} reCAPTCHA information`}
            aria-expanded={expanded}
            aria-controls={RECAPTCHA_BADGE_ID}
            onClick={() => setExpanded((value) => !value)}
          />
        )}
      </div>
    </GoogleReCaptchaProvider>
  );
};

RecaptchaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RecaptchaProvider;
