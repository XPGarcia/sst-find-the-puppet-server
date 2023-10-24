import { CardResponse } from '../dtos';
import { Card } from '../models';

export class CardMapper {
  static toResponse(card: Card): CardResponse {
    return {
      id: card.id,
      type: card.type,
      code: card.code,
      title: card.title,
      body: card.body,
      quickPlay: card.quickPlay
    };
  }

  static toResponses(cards: Card[]): CardResponse[] {
    return cards.map((card) => this.toResponse(card));
  }
}
