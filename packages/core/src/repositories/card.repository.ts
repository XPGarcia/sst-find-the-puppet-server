import * as fs from 'fs';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Card, CardType } from '../../../core/src/models';
import { environment } from '../../../core/src/configs';

const client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: environment.awsAccessKeyId,
    secretAccessKey: environment.awsSecretAccessKey
  }
});

type cardActions = {
  getCards: () => Promise<Card[]>;
};

const fsCardActions: cardActions = {
  getCards: async () => {
    const cards = JSON.parse(fs.readFileSync('assets/data/cards.json', 'utf8'));
    return cards.map((cardDoc) => new Card(cardDoc));
  }
};

const s3CardActions: cardActions = {
  getCards: async () => {
    const command = new GetObjectCommand({
      Bucket: 'find-the-puppet-storage',
      Key: 'assets/data/cards.json'
    });

    const response = await client.send(command);
    const json = await response.Body.transformToString();
    const cards = JSON.parse(json);
    return cards.map(
      (cardDoc) =>
        new Card({ ...cardDoc, id: cardDoc.id.toString(), type: cardDoc.type as CardType })
    );
  }
};

const actions = environment.deploy === 'AWS' ? s3CardActions : fsCardActions;

const CardRepository = Object.freeze(actions);

export default CardRepository;
