const CardTypes = {
  law: 'law',
  action: 'action'
} as const;

export type CardType = typeof CardTypes[keyof typeof CardTypes];

export class Card {
  id?: string;
  type: CardType;
  code: string;
  title?: string;
  body: string;
  quickPlay: boolean;
  inDeck?: boolean;

  constructor({
    id,
    type,
    code,
    title,
    body,
    quickPlay,
    inDeck = true
  }: {
    id?: string;
    type: CardType;
    code: string;
    title?: string;
    body: string;
    quickPlay: boolean;
    inDeck?: boolean;
  }) {
    this.id = id;
    this.type = type;
    this.code = code;
    this.title = title;
    this.body = body;
    this.quickPlay = quickPlay;
    this.inDeck = inDeck;
  }
}
