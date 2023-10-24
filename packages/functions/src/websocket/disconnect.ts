import { APIGatewayProxyHandler } from "aws-lambda";
import { onAPIGatewayClose } from "../../../core/src/wss/onClose";
import { broadcast } from "./response";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

export const main: APIGatewayProxyHandler = async (event) => {
  console.log(
    "Received WebSocket DISCONNECT event:",
    JSON.stringify(event, null, 2)
  );

  if (event.requestContext && event.requestContext.connectionId) {
    const { stage, domainName, connectionId } = event.requestContext;
    console.log("Connection ID:", connectionId);

    const apiG = new ApiGatewayManagementApi({
      endpoint: `https://${domainName}/${stage}`,
    });

    const response = await onAPIGatewayClose(connectionId);

    const data = JSON.stringify(response, null, 2);
    await broadcast(
      apiG,
      response.clients.map((client) => client.playerId),
      data
    );
    console.log(`Client has disconnected`);
  }

  return {
    statusCode: 200,
    body: "Disconnected",
  };
};
