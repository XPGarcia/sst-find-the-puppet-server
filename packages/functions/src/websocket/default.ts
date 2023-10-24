import { APIGatewayProxyHandler } from "aws-lambda";
import { onAPIGatewayMessage } from "../../../core/src/wss/onMessage";
import { sendPrivate, broadcast } from "./response";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

export const main: APIGatewayProxyHandler = async (event) => {
  console.log(
    "Received WebSocket DEFAULT event:",
    JSON.stringify(event, null, 2)
  );

  if (event.requestContext && event.body && event.requestContext.connectionId) {
    const { stage, domainName, connectionId } = event.requestContext;
    console.log("Connection ID:", connectionId);

    const apiG = new ApiGatewayManagementApi({
      endpoint: `https://${domainName}/${stage}`,
    });

    const response = await onAPIGatewayMessage(connectionId, event.body);
    const data = JSON.stringify(response, null, 2);

    if (response.communicationType === "private") {
      await sendPrivate(apiG, connectionId, data);
    } else {
      await broadcast(
        apiG,
        response.clients.map((client) => client.playerId),
        data
      );
    }
  }

  return {
    statusCode: 200,
    body: "Default handled",
  };
};
