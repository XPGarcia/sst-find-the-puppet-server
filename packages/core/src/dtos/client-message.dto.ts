const eventTypes = ['room', 'game', 'deck', 'actionCard', 'voting', 'card'] as const;

export type EventType = (typeof eventTypes)[number];

export interface ClientMessage {
  roomId: string;
  playerId: string;
  eventType: EventType;
  action: string;
  payload?: any;
}
