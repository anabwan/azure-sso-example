import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { GraphData } from "../../../utils/types";
import { useMsal } from "@azure/msal-react";

import { loginRequest } from "./msal";
import {
  AccountInfo,
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { callMsGraph } from "./MsGraphApiCall";

interface UserContextProps {
  graphData: GraphData | null;
  setGraphData: React.Dispatch<React.SetStateAction<GraphData | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
    <UserContext.Provider value={{ graphData, setGraphData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within an UserProvider");
  }
  return context;
};
