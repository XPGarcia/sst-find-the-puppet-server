import RoomRepository from '../repositories/room-repository';
import { MyWebSocket, MyWebSocketServer } from '../models/websocket';
import { WssResponse } from 'src/dtos';

export async function onWSClose(wss: MyWebSocketServer, ws: MyWebSocket) {
  try {
    const room = await RoomRepository.getRoom(ws.roomId);
    if (!room) return;

    room.removeClient(ws.playerId);
    if (room.clients.length === 0) await RoomRepository.removeRoom(room.id);
    const wssResponse = {
      responseType: 'room',
      roomId: room.id,
      hostName: room.hostName,
      clients: room.clients,
      message: '{}',
      communicationType: 'broadcast'
    };
    wss.broadcast(JSON.stringify(wssResponse), room.id);
    console.log(`Client has disconnected`);
  } catch (err) {
    console.log(err);
  }
}

export async function onAPIGatewayClose(playerId: string): Promise<WssResponse> {
  const room = await RoomRepository.getRoomByPlayerId(playerId);
  if (!room) return;

  room.removeClient(playerId);
  if (room.clients.length === 0) await RoomRepository.removeRoom(room.id);
  const wssResponse: WssResponse = {
    responseType: 'room',
    roomId: room.id,
    hostName: room.hostName,
    clients: room.clients,
    message: '{}',
    communicationType: 'broadcast'
  };
  return wssResponse;
}
