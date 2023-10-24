import { WebSocketApi, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function WSApi({ stack }: StackContext) {
  const { table } = use(StorageStack);

  const webSocketApi = new WebSocketApi(stack, "Api", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      $connect: "packages/functions/src/websocket/connect.main",
      $default: "packages/functions/src/websocket/default.main",
      $disconnect: "packages/functions/src/websocket/disconnect.main",
      getPlayerId: "packages/functions/src/websocket/getPlayerId.main",
    },
  });

  stack.addOutputs({
    webSocketApi: webSocketApi.url,
  });

  return {
    webSocketApi,
  };
}
