import { random, shuffle } from '../utils';
import { Card, Game, PartialGame } from '../models';
import { DeckService } from './deck.service';
import { Room } from 'src/models/room.model';

export class GameService {
  static setGame(room: Room, partialGame: PartialGame) {
    const newGame = new Game({ ...room.game, ...partialGame });
    room.setGame(newGame);
  }

  static async setup(playersIds: string[]) {
    const deck = await DeckService.new();

    const gpOne = random<string>(playersIds);
    const gpTwo = random<string>(playersIds.filter((id) => id !== gpOne));
    const governmentPlayers = [gpOne, gpTwo];

    const oppositionPlayers = playersIds.filter((id) => id !== gpOne && id !== gpTwo);

    const playerAsPresident = random<string>(playersIds);

    const presidentIndex = (playersIds as string[]).findIndex(
      (playerId) => playerId === playerAsPresident
    );

    const firstPlayerIndex = presidentIndex + 1 === playersIds.length ? 0 : presidentIndex + 1;
    const playerInTurn = playersIds[firstPlayerIndex];

    return {
      deck: shuffle<Card>(deck),
      playerInTurn,
      playerAsPresident,
      governmentPlayers,
      oppositionPlayers
    };
  }

  static updateDeckAfterDraw(game: Game, cardsDrawn: Card[]) {
    game.deck.forEach((cardInDeck) => {
      cardsDrawn.forEach((cardDrawn) => {
        if (cardInDeck === cardDrawn) cardInDeck.inDeck = false;
      });
    });
  }

  static endTurn(room: Room) {
    const game = room.game;
    const playersIds = game.players.map((player) => player.playerId);
    const playerIndex = playersIds.findIndex((id) => id === game.playerInTurn);

    const nextPlayerIndex = playerIndex + 1 === playersIds.length ? 0 : playerIndex + 1;
    const playerInTurn = playersIds[nextPlayerIndex];

    const roundsPlayed =
      ++game.turnsPlayed % game.numberOfPlayers === 0 ? this.endRound(game) : game.roundsPlayed;

    this.setGame(room, { ...game, playerInTurn, roundsPlayed });
  }

  static endRound(game: Game) {
    const roundsPlayed = game.roundsPlayed + 1;
    const roundsForNextElections = game.roundsForNextElections - 1;

    game.roundsForNextElections = roundsForNextElections <= 0 ? 4 : roundsForNextElections;
    game.turnsPlayed = 0;

    return roundsPlayed;
  }

  static checkWinConditionByLaws(game: Game): 'DEMOCRATS_WON' | 'FASCISTS_WON' | undefined {
    let approvedLawsByDemocrats = 0;
    let approvedLawsByFascists = 0;
    game.approvedLaws.forEach((approvedLaw) => {
      if (game.governmentPlayers.find((playerId) => playerId === approvedLaw.player.playerId))
        approvedLawsByFascists++;
      else approvedLawsByDemocrats++;
    });
    if (this.democratsWonByApprovedLaws(approvedLawsByDemocrats)) return 'DEMOCRATS_WON';
    else if (this.fascistsWonByApprovedLaws(approvedLawsByFascists, game)) return 'FASCISTS_WON';
  }

  private static democratsWonByApprovedLaws(approvedLaws: number) {
    const democratLawsToWin = 7;
    return approvedLaws >= democratLawsToWin;
  }

  private static fascistsWonByApprovedLaws(approvedLaws: number, game: Game) {
    const fascistLawsToWin = 5;
    const fascistLawsToWinWithPresident = 3;
    const isFascistPresident = game.governmentPlayers.find(
      (playerId) => playerId === game.playerAsPresident
    );
    return (
      approvedLaws >= fascistLawsToWin ||
      (approvedLaws >= fascistLawsToWinWithPresident && isFascistPresident)
    );
  }

  static checkWinConditionByPlayers(game: Game): 'DEMOCRATS_WON' | 'FASCISTS_WON' | undefined {
    let democratPlayers = 0;
    let fascistPlayers = 0;
    game.players.forEach((player) => {
      if (game.governmentPlayers.find((playerId) => playerId === player.playerId)) fascistPlayers++;
      else democratPlayers++;
    });
    if (fascistPlayers === 0) return 'DEMOCRATS_WON';
    else if (democratPlayers === 0) return 'FASCISTS_WON';
    return;
  }
}
