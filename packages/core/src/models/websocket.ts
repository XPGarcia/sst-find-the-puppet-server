import WebSocket, { WebSocketServer } from 'ws';

export interface MyWebSocketServer extends WebSocketServer {
  broadcast: (data: string, roomId: string) => void;
}

export interface MyWebSocket extends WebSocket {
  roomId: string;
  playerId: string;
}
