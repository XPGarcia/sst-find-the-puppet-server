import { Game } from 'src/models';
import { Room } from 'src/models/room.model';
import { WssPartialResponse } from '../dtos';
import { CardMapper } from '../mappers';
import { DeckService } from '../services';

const deckEventActions = ['draw', 'drawByIds', 'look'] as const;

export type DeckEventAction = typeof deckEventActions[number];

export class DeckEventManager {
  private static draw(game: Game, quantity: number): WssPartialResponse {
    const cards = DeckService.draw({ game, quantity });

    const cardResponse = CardMapper.toResponses(cards);

    return {
      responseType: 'deck',
      message: JSON.stringify(cardResponse),
      communicationType: 'private'
    };
  }

  private static drawByIds(game: Game, cardsIds: string[]): WssPartialResponse {
    const cards = DeckService.drawByIds(game, cardsIds);

    return { responseType: 'deck', message: JSON.stringify(cards), communicationType: 'private' };
  }

  private static look(game: Game): WssPartialResponse {
    const deck = DeckService.look(game);

    return { responseType: 'deck', message: JSON.stringify(deck), communicationType: 'private' };
  }

  static getResponse(room: Room, eventName: DeckEventAction, payload?: any): WssPartialResponse {
    switch (eventName) {
      case 'draw':
        return this.draw(room.game, payload.quantity);
      case 'drawByIds':
        return this.drawByIds(room.game, payload.cardsIds);
      case 'look':
        return this.look(room.game);
    }
  }
}
