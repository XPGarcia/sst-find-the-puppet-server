import { environment } from './configs';
import app from './app';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';

// const serverOptions = {
//   cert: fs.readFileSync(environment.certificatePath),
//   key: fs.readFileSync(environment.keyPath)
// };

// export const server =
//   environment.env === 'DEVELOPMENT'
//     ? http.createServer(app)
//     : https.createServer(serverOptions, app);

export const server = http.createServer(app);

export const start = () => {
  // 8443
  server.listen(environment.port, () => {
    console.log(`The server is running on port ${environment.port}`);
  });
};

export default server;
