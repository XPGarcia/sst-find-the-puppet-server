import { ClientMessage } from '../dtos';
import { EventListener } from '../event-listener';
import { MyWebSocket, MyWebSocketServer } from '../models/websocket';
import RoomRepository from '../../../core/src/repositories/room-repository';

export async function onWSMessage(wss: MyWebSocketServer, ws: MyWebSocket, data: string) {
  try {
    const clientMessage = JSON.parse(data) as ClientMessage;
    console.log('----- Client Message -----');
    console.log(clientMessage);
    console.log('***************************');
    if (!clientMessage.eventType) return;

    const room = await RoomRepository.getRoom(clientMessage.roomId);
    const wssResponse = await EventListener.execute(room, clientMessage);
    ws.roomId = wssResponse.roomId;

    console.log('----- Server Response -----');
    console.log(wssResponse);
    console.log('***************************');
    if (wssResponse.communicationType === 'private') {
      ws.send(JSON.stringify(wssResponse));
    } else {
      wss.broadcast(JSON.stringify(wssResponse), wssResponse.roomId);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function onAPIGatewayMessage(playerId: string, data: string) {
  const clientMessage = JSON.parse(data) as ClientMessage;
  if (
    clientMessage.eventType === 'room' &&
    (clientMessage.action === 'create' || clientMessage.action === 'join')
  ) {
    clientMessage.payload.playerId = playerId;
  }
  console.log('----- Client Message -----');
  console.log(clientMessage);
  console.log('***************************');

  const room = await RoomRepository.getRoom(clientMessage.roomId);
  const response = await EventListener.execute(room, clientMessage);

  console.log('----- Server Response -----');
  console.log(response);
  console.log('***************************');

  return response;
}
