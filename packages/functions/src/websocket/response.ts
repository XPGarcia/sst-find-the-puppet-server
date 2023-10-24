import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

export async function sendPrivate(
  client: ApiGatewayManagementApi,
  id: string,
  body: string
) {
  try {
    await client.postToConnection({
      ConnectionId: id,
      Data: Buffer.from(body),
    });
  } catch (e) {
    console.log(e);
  }
}

export async function broadcast(
  client: ApiGatewayManagementApi,
  ids: string[],
  body: string
) {
  const allPromises = ids.map((id) => sendPrivate(client, id, body));
  return Promise.all(allPromises);
}
