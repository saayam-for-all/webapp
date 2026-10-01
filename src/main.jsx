import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import App from "./App.jsx";
import i18n from "./common/i18n/i18n.js";
import { store } from "./redux/store.js";
import awsConfig from "./utils/config/aws-exports.js";

import "@fontsource-variable/inter";
import "./index.css";

Amplify.configure(awsConfig);

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        {recaptchaSiteKey ? (
          <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
            <App />
          </GoogleReCaptchaProvider>
        ) : (
          <App />
        )}
      </I18nextProvider>
    </Provider>
  </React.StrictMode>,
);
