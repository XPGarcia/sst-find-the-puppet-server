import * as server from './server';
import * as wss from './wss';

const start = () => {
  wss.start();
  server.start();
};

start();
