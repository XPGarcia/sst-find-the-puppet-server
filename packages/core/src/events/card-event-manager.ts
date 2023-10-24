import { CardMapper, GameMapper } from '../mappers';
import { VotingService } from '../services';
import { WssPartialResponse } from '../dtos';
import { Card, Player, Room } from '../models';

export type CardEventAction = 'startAction' | 'endAction' | 'approveLaw';

export class CardEventManager {
  private static startAction(card: Card): WssPartialResponse {
    return {
      responseType: 'card',
      message: JSON.stringify({ card }),
      communicationType: 'broadcast'
    };
  }

  private static endAction(card: Card): WssPartialResponse {
    return {
      responseType: 'card',
      message: JSON.stringify({}),
      communicationType: 'broadcast'
    };
  }

  private static approveLaw(room: Room, player: Player, card: Card): WssPartialResponse {
    VotingService.approveLaw(room, player, card.id);
    const message = `${player.playerName} ha aprobado una ley inmediatamente`;
    return {
      responseType: 'card',
      message: JSON.stringify({
        card: CardMapper.toResponse(card),
        game: GameMapper.toResponse(room.game),
        message
      }),
      communicationType: 'broadcast',
      status: 'PLAYING'
    };
  }

  static getResponse(room: Room, eventName: CardEventAction, payload?: any): WssPartialResponse {
    switch (eventName) {
      case 'startAction':
        return this.startAction(payload.card);
      case 'endAction':
        return this.endAction(payload.card);
      case 'approveLaw':
        return this.approveLaw(room, payload.player, payload.card);
    }
  }
}
