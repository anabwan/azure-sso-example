import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { msalConfig } from "./services/msal/msal";
import {
  PublicClientApplication,
  EventType,
  AuthenticationResult,
  EventMessage,
} from "@azure/msal-browser";
import "@spark-design/css/global/index.css";
import "@spark-design/fonts/fonts.css";
import App from "./App";

export const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
    }
  });

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Router>
        <App pca={msalInstance} />
      </Router>
    </React.StrictMode>
  );
});
