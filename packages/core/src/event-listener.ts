/* eslint-disable no-case-declarations */
import { ClientMessage, WssPartialResponse, WssResponse } from './dtos';
import {
  CardEventManager,
  DeckEventAction,
  DeckEventManager,
  GameEventAction,
  GameEvents,
  RoomEventManager,
  VotingEventAction,
  VotingEventManager
} from './events';
import { RoomEventAction, CardEventAction } from './events';
import { Room } from './models';

export class EventListener {
  static async execute(room: Room, message: ClientMessage): Promise<WssResponse> {
    let wssResponse: WssResponse = room && {
      roomId: room.id,
      hostName: room.hostName,
      clients: room.clients,
      message: '',
      responseType: 'game',
      communicationType: 'private'
    };

    let partialResponse: WssPartialResponse;

    switch (message.eventType) {
      case 'room':
        const roomEventName = message.action as RoomEventAction;
        return await RoomEventManager.getResponse(roomEventName, message.payload);
      case 'game':
        const gameEventName = message.action as GameEventAction;
        partialResponse = await GameEvents.getResponse(room, gameEventName, message.payload);
        break;
      case 'deck':
        const deckEventName = message.action as DeckEventAction;
        partialResponse = DeckEventManager.getResponse(room, deckEventName, message.payload);
        break;
      case 'voting':
        const votingEventName = message.action as VotingEventAction;
        partialResponse = VotingEventManager.getResponse(room, votingEventName, message.payload);
        break;
      case 'card':
        const cardEventName = message.action as CardEventAction;
        partialResponse = CardEventManager.getResponse(room, cardEventName, message.payload);
        break;
    }

    wssResponse = { ...wssResponse, ...partialResponse };

    return wssResponse;
  }
}
