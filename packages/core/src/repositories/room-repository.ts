import { Room } from 'src/models';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';

import { environment } from '../../../core/src/configs';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const rooms: Room[] = [];

type RoomActions = {
  createRoom: (room: Room) => Promise<void>;
  removeRoom: (roomId: string) => Promise<void>;
  getRoom: (roomId: string) => Promise<Room>;
  getRoomByPlayerId: (playerId: string) => Promise<Room | undefined>;
};

const inMemoryRoomActions: RoomActions = {
  createRoom: async (room: Room) => {
    rooms.push(room);
  },
  removeRoom: async (roomId: string) => {
    rooms.filter((room) => room.id !== roomId);
  },
  getRoom: async (roomId: string) => {
    return rooms.find((room) => room.id === roomId);
  },
  getRoomByPlayerId: async (playerId: string) => {
    let searchedRoom: Room;
    rooms.forEach((room) => {
      const client = room.clients.find((client) => client.playerId === playerId);
      if (!client) return;

      searchedRoom = room;
    });
    return searchedRoom;
  }
};

const dynamoDBRoomActions: RoomActions = {
  createRoom: async (room: Room) => {
    const command = new PutCommand({
      TableName: 'Rooms',
      Item: {
        roomId: room.id,
        room
      }
    });

    await docClient.send(command);
  },
  removeRoom: async (roomId: string) => {
    const command = new DeleteCommand({
      TableName: 'Rooms',
      Key: {
        roomId
      }
    });

    await docClient.send(command);
  },
  getRoom: async (roomId: string) => {
    const command = new GetCommand({
      TableName: 'Rooms',
      Key: {
        roomId
      }
    });
    const room = await docClient.send(command);
    return JSON.parse(room.Item['room']);
  },
  getRoomByPlayerId: async (playerId: string) => {
    let searchedRoom: Room;
    rooms.forEach((room) => {
      const client = room.clients.find((client) => client.playerId === playerId);
      if (!client) return;

      searchedRoom = room;
    });
    return searchedRoom;
  }
};

const actions = environment.deploy === 'AWS' ? inMemoryRoomActions : inMemoryRoomActions;

const RoomRepository = Object.freeze(actions);

export default RoomRepository;
