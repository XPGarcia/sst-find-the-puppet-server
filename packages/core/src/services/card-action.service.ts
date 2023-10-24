import { Room } from '../models';
import {
  CorruptionInvestigationAction,
  CoupAction,
  MKUltraAction
} from '../constants/card-action.constant';
import { GameService } from './game.service';

export class CardActionService {
  static mkUltra(room: Room, cardAction: MKUltraAction) {
    const governmentPlayer = room.game.governmentPlayers.find(
      (playerId) => playerId === cardAction.selectedPlayerId
    );

    return governmentPlayer ? 'government' : 'opposition';
  }

  static coup(room: Room, cardAction: CoupAction) {
    const playerId = cardAction.playerId;
    GameService.setGame(room, { playerAsPresident: playerId });
  }

  static corruptionInvestigation(room: Room, cardAction: CorruptionInvestigationAction) {
    const selectedPlayerId = cardAction.selectedPlayerId;
    const blockedPlayers = [...room.game.blockedPlayers];
    blockedPlayers.push(selectedPlayerId);
    GameService.setGame(room, { blockedPlayers });
  }
}
