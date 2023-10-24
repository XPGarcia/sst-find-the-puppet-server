import { GameStatus } from '../models';

export interface WssPartialResponse {
  responseType: 'room' | 'game' | 'card' | 'deck' | 'voting';
  message: string;
  communicationType: 'broadcast' | 'private';
  status?: GameStatus;
}

export interface WssResponse extends WssPartialResponse {
  roomId: string;
  hostName?: string;
  clients: { playerId: string; playerName: string; playerProfile: string }[];
}
