import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "./redux/reducers";
import { i18n } from "element-react";
import locale from "element-react/src/locale/lang/en";

import "./index.scss";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import App from "./components/App";
import history from "./history";
import "antd/dist/antd.css";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
i18n.use(locale);

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<App />
		</Router>
	</Provider>,
	document.getElementById("root")
);
