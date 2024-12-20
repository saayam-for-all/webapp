import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./common/i18n/i18n.js";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

import "@fontsource-variable/inter";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Provider store={store}>
			<I18nextProvider i18n={i18n}>
				<App />
			</I18nextProvider>
		</Provider>
	</React.StrictMode>
);
