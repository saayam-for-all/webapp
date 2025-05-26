import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { Provider } from "react-redux";
//import { I18nextProvider } from "react-i18next";
import App from "./App.jsx";
import i18n from "./common/i18n/i18n.js";
import { store } from "./redux/store.js";
import awsConfig from "./utils/config/aws-exports.js";

import "@fontsource-variable/inter";
import "./index.css";

Amplify.configure(awsConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <I18nextProvider i18n={i18n}> */}
      <App />
      {/* </I18nextProvider> */}
    </Provider>
  </React.StrictMode>,
);
