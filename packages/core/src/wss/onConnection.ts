import { MyWebSocket } from '../models/websocket';
import { getRandomId } from '../utils';

export function onWSConnection(ws: MyWebSocket) {
  const playerId = getRandomId().toString();
  ws.playerId = playerId;
  ws.send(JSON.stringify({ responseType: 'connection', playerId }));
}
