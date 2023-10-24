import CardRepository from 'src/repositories/card.repository';
import { Card, Game } from '../models';
import { GameService } from './game.service';

export class DeckService {
  static async new(): Promise<Card[]> {
    return await CardRepository.getCards();
  }

  static draw({ game, quantity = 1 }: { game: Game; quantity?: number }) {
    const cards = game.deck;
    const cardsInDeck = cards.filter((card) => card.inDeck);

    const cardsDrawn = cardsInDeck.slice(0, quantity);
    GameService.updateDeckAfterDraw(game, cardsDrawn);

    return cardsDrawn;
  }

  static drawByIds(game: Game, cardsIds: string[]) {
    const cards = game.deck;
    const selectedCards: Card[] = [];

    cardsIds.forEach((cardId) => {
      cards.forEach((card) => {
        if (card.id === cardId) selectedCards.push(card);
      });
    });

    GameService.updateDeckAfterDraw(game, selectedCards);

    return selectedCards;
  }

  static look(game: Game) {
    return game.deck.filter((card) => card.inDeck);
  }
}
