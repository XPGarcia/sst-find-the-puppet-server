import { APIGatewayProxyHandler } from "aws-lambda";

export const main: APIGatewayProxyHandler = async (event) => {
  console.log(
    "Received WebSocket CONNECTION event:",
    JSON.stringify(event, null, 2)
  );

  if (event.requestContext && event.requestContext.connectionId) {
    const { connectionId } = event.requestContext;
    console.log("Connection ID:", connectionId);
  }

  return {
    statusCode: 200,
    body: "Connected",
  };
};
