import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import LoadingIndicator from "./components/Universal/LoadingIndicator";
import theme from "./Theme";
import { ThemeProvider } from "@material-ui/core/styles";
import store from "./app/store";
import { Provider } from "react-redux";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const rootElement = document.getElementById("root");

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter basename={baseUrl}>
      <Provider store={store}>
        <App />
      </Provider>
      <LoadingIndicator />
    </BrowserRouter>
  </ThemeProvider>,
  rootElement
);

// Uncomment the line above that imports the registerServiceWorker function
// and the line below to register the generated service worker.
// By default create-react-app includes a service worker to improve the
// performance of the application by caching static assets. This service
// worker can interfere with the Identity UI, so it is
// disabled by default when Identity is being used.
//
registerServiceWorker();
