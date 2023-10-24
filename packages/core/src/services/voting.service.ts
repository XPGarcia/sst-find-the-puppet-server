import { ApprovedLaw, Player, Room } from '../models';
import { VotingOptions } from '../models';
import { GameService } from './game.service';

export class VotingService {
  static execute(room: Room, options: VotingOptions) {
    switch (options.type) {
      case 'startVoting':
        break;
      case 'approveLaw':
        this.approveLaw(room, options.params.player, options.params.cardId);
        break;
      case 'presidentElection':
        this.presidentElection(room, options.params.playerId);
        break;
    }
  }

  static approveLaw(room: Room, player: Player, cardId: string) {
    const approvedLaw = new ApprovedLaw({ player, cardId });
    const approvedLaws = [...room.game.approvedLaws];
    approvedLaws.push(approvedLaw);
    GameService.setGame(room, { approvedLaws });
  }

  static presidentElection(room: Room, playerId: string) {
    const playerAsPresident = playerId;
    GameService.setGame(room, { playerAsPresident });
  }
}
