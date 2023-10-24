import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const environment = {
  deploy: process.env.APP_DEPLOY ?? 'LOCAL',
  env: process.env.APP_ENV ?? 'DEVELOPMENT',
  port: process.env.PORT ?? 3000,
  awsAccessKeyId: process.env.MY_AWS_ACCESS_KEY_ID ?? '',
  awsSecretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY ?? ''
};
