import * as express from 'express';
import { json } from 'body-parser';

const app = express();

app.use(json());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.get('/health/ready', (req, res) => {
  res.send('OK!');
});

export default app;
