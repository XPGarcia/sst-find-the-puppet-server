import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { WSApi } from "./stacks/WebsocketStack";

export default {
  config(_input) {
    return {
      name: "sst-find-the-puppet-server",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack);
    app.stack(WSApi);
  },
} satisfies SSTConfig;
