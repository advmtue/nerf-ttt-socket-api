import express from 'express';
import * as bodyParser from 'body-parser';
import socketio from 'socket.io';

import SocketHandler from './socket-handler';
import WebController from './web-controller';

// Create an express application
const app = express();
app.use(bodyParser.json());

// Create an IO server and bind it to the HttpServer
const io = socketio();

// Create a new socket handler
const socketHandler = new SocketHandler(io);
new WebController(app, socketHandler);

const APP_PORT = 8081;
const IO_PORT = 8082;

app.listen(APP_PORT, () => {
  console.log(`[API] Started API on port :${APP_PORT}`);

  // Start IO
  io.listen(IO_PORT);
  console.log(`[SOCKET] Started listening for socket connections on port :${IO_PORT}`);
});
