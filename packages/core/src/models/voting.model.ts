import { Card } from './card.model';
import { Player } from './player.model';

export type Vote = 'YES' | 'NO';

export interface EliminateVote {
  selectedPlayerId: string;
}

const VotingTypes = {
  approveLaw: 'approveLaw',
  presidentElection: 'presidentElection',
  eliminatePlayer: 'eliminatePlayer'
} as const;

type StartVoting = {
  type: 'startVoting';
};

type ApproveLawOptions = {
  type: 'approveLaw';
  params: {
    player: Player;
    cardId: string;
  };
};

type PresidentElectionOptions = {
  type: 'presidentElection';
  params: {
    playerId: string;
  };
};

export type VotingOptions = StartVoting | ApproveLawOptions | PresidentElectionOptions;

export type VotingType = typeof VotingTypes[keyof typeof VotingTypes];
