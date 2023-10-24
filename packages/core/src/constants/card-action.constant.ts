export type MKUltraAction = {
  selectedPlayerId: string;
};

export type CoupAction = {
  playerId: string;
};

export type CorruptionInvestigationAction = {
  selectedPlayerId: string;
};

export type CardAction = MKUltraAction | CoupAction | CorruptionInvestigationAction;
