import { APIGatewayProxyHandler } from "aws-lambda";
import { sendPrivate } from "./response";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

export const main: APIGatewayProxyHandler = async (event) => {
  console.log(
    "Received WebSocket GET PLAYER ID event:",
    JSON.stringify(event, null, 2)
  );

  if (event.requestContext && event.requestContext.connectionId) {
    const { domainName, stage, connectionId } = event.requestContext;
    console.log("Connection ID:", connectionId);

    const apiG = new ApiGatewayManagementApi({
      endpoint: `https://${domainName}/${stage}`,
    });

    const data = { responseType: "connection", playerId: connectionId };

    await sendPrivate(apiG, connectionId, JSON.stringify(data));
  }

  return {
    statusCode: 200,
    body: "Get player ID",
  };
};
