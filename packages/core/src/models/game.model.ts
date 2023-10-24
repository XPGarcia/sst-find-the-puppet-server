import { ApprovedLaw } from './approved-law.model';
import { Card } from './card.model';
import { Player } from './player.model';
import { random } from '../utils';

const gameStatuses = [
  'INROOM',
  'WAITING',
  'WAITING_VOTING',
  'LAW_VOTING',
  'ELIMINATE_VOTING',
  'PRESIDENT_VOTING',
  'PLAYING',
  'DEMOCRATS_WON',
  'FASCISTS_WON'
] as const;

export type GameStatus = (typeof gameStatuses)[number];

export class Game {
  id?: string;
  numberOfPlayers: number;
  players: Player[];
  playerInTurn: string;
  playerAsPresident: string;
  turnsPlayed: number;
  roundsPlayed: number;
  roundsForNextElections: number;
  governmentPlayers: string[];
  oppositionPlayers: string[];
  deck: Card[];
  approvedLaws: ApprovedLaw[];
  blockedPlayers?: string[];
  cardOnBoard?: Card;

  constructor({
    id,
    numberOfPlayers,
    players,
    playerInTurn,
    playerAsPresident,
    turnsPlayed,
    roundsPlayed,
    roundsForNextElections,
    governmentPlayers,
    oppositionPlayers,
    deck,
    approvedLaws,
    blockedPlayers,
    cardOnBoard
  }: {
    id?: string;
    numberOfPlayers: number;
    players: Player[];
    playerInTurn: string;
    playerAsPresident: string;
    turnsPlayed: number;
    roundsPlayed: number;
    roundsForNextElections: number;
    governmentPlayers: string[];
    oppositionPlayers: string[];
    deck: Card[];
    approvedLaws: ApprovedLaw[];
    blockedPlayers?: string[];
    cardOnBoard?: Card;
  }) {
    this.id = id;
    this.numberOfPlayers = numberOfPlayers;
    this.players = players;
    this.playerInTurn = playerInTurn;
    this.playerAsPresident = playerAsPresident;
    this.turnsPlayed = turnsPlayed;
    this.roundsPlayed = roundsPlayed;
    this.roundsForNextElections = roundsForNextElections;
    this.governmentPlayers = governmentPlayers;
    this.oppositionPlayers = oppositionPlayers;
    this.deck = deck;
    this.approvedLaws = approvedLaws;
    this.blockedPlayers = blockedPlayers;
    this.cardOnBoard = cardOnBoard;
  }

  eliminatePlayer(eliminatedPlayerId: string) {
    const index = this.players.findIndex((player) => player.playerId === eliminatedPlayerId);
    const eliminatedPlayer = this.players[index];

    this.players = this.players.filter((player) => player.playerId !== eliminatedPlayerId);
    if (eliminatedPlayerId === this.playerAsPresident) this.playerAsPresident = '';
    if (eliminatedPlayerId === this.playerInTurn) {
      const nextIndex = index >= this.players.length ? 0 : index;
      this.playerInTurn = this.players[nextIndex].playerId;
    }
    this.numberOfPlayers = this.players.length;
    return eliminatedPlayer;
  }

  changePresident(selectedPresidentId: string) {
    if (selectedPresidentId) {
      this.playerAsPresident = selectedPresidentId;
      return this.players.find((player) => player.playerId === selectedPresidentId);
    }

    let randomPresident = random(this.players);
    // eslint-disable-next-line no-loops/no-loops
    while (randomPresident.playerId === this.playerAsPresident)
      randomPresident = random(this.players);

    this.playerAsPresident = randomPresident.playerId;
    return randomPresident;
  }

  handleBlockedPlayer(player: Player) {
    const blockedPlayerId = this.blockedPlayers.find((playerId) => playerId === player.playerId);
    if (!blockedPlayerId) return;

    this.blockedPlayers = this.blockedPlayers.filter((playerId) => playerId !== blockedPlayerId);
    return blockedPlayerId;
  }
}
