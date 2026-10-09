import PropTypes from "prop-types";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export const RECAPTCHA_BADGE_ID = "recaptcha-badge";

// Wraps the whole app so reCAPTCHA v3 can score behavior across every page.
// The badge sits bottom-left because the scroll-to-top button owns bottom-right.
const RecaptchaProvider = ({ children }) => (
  <GoogleReCaptchaProvider
    reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
    container={{
      element: RECAPTCHA_BADGE_ID,
      parameters: { badge: "bottomleft" },
    }}
  >
    {children}
    <div id={RECAPTCHA_BADGE_ID} />
  </GoogleReCaptchaProvider>
);

RecaptchaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RecaptchaProvider;
