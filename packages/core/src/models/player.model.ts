export class Player {
  playerId: string;
  playerName: string;
  playerProfile: string;

  constructor({
    playerId,
    playerName,
    playerProfile
  }: {
    playerId: string;
    playerName: string;
    playerProfile: string;
  }) {
    this.playerId = playerId;
    this.playerName = playerName;
    this.playerProfile = playerProfile;
  }
}
