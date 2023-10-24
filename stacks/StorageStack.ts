import { Bucket, StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "Storage", {
    name: "find-the-puppet-storage",
  });

  const table = new Table(stack, "Rooms", {
    fields: {
      roomId: "string",
      room: "string",
    },
    primaryIndex: { partitionKey: "roomId" },
  });

  return {
    bucket,
    table,
  };
}
