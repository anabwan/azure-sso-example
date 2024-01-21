import React from "react";
import { Button, Flex, Text } from "@spark-design/react";
import { useMsal } from "@azure/msal-react";
import { useUserContext } from "../services/msal/userContext";

export const Dashboard: React.FC = () => {
  const { graphData } = useUserContext();
  const { instance } = useMsal();

  return (
    <>
      <Flex direction="column">
        <Text>{graphData?.displayName}</Text>
        <Text>{graphData?.jobTitle}</Text>
        <Text>{graphData?.mail}</Text>
        <Text>{graphData?.businessPhones[0]}</Text>
        <Text>{graphData?.officeLocation}</Text>

        <Button onPress={() => instance.logoutRedirect()}>Logout</Button>
      </Flex>
    </>
  );
};
