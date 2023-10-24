import { Player } from './player.model';

export class ApprovedLaw {
  player: Player;
  cardId: string;

  constructor({ player, cardId }: { player: Player; cardId: string }) {
    this.player = player;
    this.cardId = cardId;
  }
}
