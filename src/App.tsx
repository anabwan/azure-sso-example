import { Routes, Route, useNavigate } from "react-router-dom";
import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  MsalAuthenticationTemplate,
} from "@azure/msal-react";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";

import { loginRequest } from "./services/msal/msal";
import {
  InteractionStatus,
  InteractionRequiredAuthError,
  IPublicClientApplication,
  AccountInfo,
  InteractionType,
} from "@azure/msal-browser";
import { CustomNavigationClient } from "./services/msal/NavigatorClient";
import { useEffect, useState } from "react";
import { callMsGraph } from "./services/msal/MsGraphApiCall";
import { GraphData } from "../utils/types";
import { UserProvider } from "./services/msal/userContext";

type AppProps = {
  pca: IPublicClientApplication;
};

const WrapperView = () => {
  const { instance, inProgress } = useMsal();
  const [graphData, setGraphData] = useState<null | GraphData>(null);

  useEffect(() => {
    if (!graphData && inProgress === InteractionStatus.None) {
      callMsGraph()
        .then((response) => setGraphData(response))
        .catch((e) => {
          if (e instanceof InteractionRequiredAuthError) {
            instance.loginRedirect({
              ...loginRequest,
              account: instance.getActiveAccount() as AccountInfo,
            });
          }
        });
    }
  }, [inProgress, graphData, instance]);

  return (
    <>
      <AuthenticatedTemplate>{graphData && <Pages />}</AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
    </>
  );
};

const App: React.FC<AppProps> = ({ pca }) => {
  const navigate = useNavigate();
  const navigationClient = new CustomNavigationClient(navigate);

  pca.setNavigationClient(navigationClient);

  const authRequest = {
    ...loginRequest,
  };

  return (
    <MsalProvider instance={pca}>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={authRequest}
      >
        <UserProvider>
          <WrapperView />
        </UserProvider>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
};

function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
