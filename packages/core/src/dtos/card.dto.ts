import { CardType } from 'src/models';

export interface CardResponse {
  id: string;
  type: CardType;
  code: string;
  title?: string;
  body: string;
  quickPlay: boolean;
}
