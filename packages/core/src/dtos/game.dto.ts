import { ApprovedLaw, Card, Player } from '../models';

export interface GameResponse {
  id: string;
  players: Player[];
  numberOfPlayers: number;
  playerInTurn: string;
  playerAsPresident: string;
  turnsPlayed: number;
  roundsPlayed: number;
  roundsForNextElections: number;
  approvedLaws: ApprovedLaw[];
  governmentPlayers: string[];
  oppositionPlayers: string[];
  blockedPlayers: string[];
  cardOnBoard?: Card;
}
