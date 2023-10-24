import server from './server';
import { WebSocketServer } from 'ws';
import { MyWebSocket, MyWebSocketServer } from './models/websocket';
import { onWSMessage } from './wss/onMessage';
import { onWSClose } from './wss/onClose';
import { onWSConnection } from './wss/onConnection';

export const wss = new WebSocketServer({
  server
}) as MyWebSocketServer;

export const start = () => {
  wss.broadcast = function broadcast(data: string, roomId: string) {
    wss.clients.forEach(function each(client: MyWebSocket) {
      if (client.roomId === roomId) client.send(data);
    });
  };

  wss.on('connection', (ws: MyWebSocket) => {
    ws.on('message', (data: string) => onWSMessage(wss, ws, data));

    ws.on('close', () => onWSClose(wss, ws));

    ws.onerror = onError;

    onWSConnection(ws);
    console.log(`Client connected`);
  });
};

function onError() {
  console.log('Some Error occurred');
}
