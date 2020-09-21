import { isExpressionStatement } from 'typescript';

import express from 'express';
import SocketHandler from './socket-handler';

export default class WebController {
  private _app: express.Application;
  private _io: SocketHandler;

  constructor(app: express.Application, socketHandler: SocketHandler) {
    this._app = app;
    this._io = socketHandler;

    this._createRoutes();
  }

  private _createRoutes() {
    this._app.post('/lobby/:lobbyId/playerjoin', this._onLobbyPlayerJoin.bind(this));
    this._app.post('/lobby/:lobbyId/playerleave', this._onLobbyPlayerLeave.bind(this));
    this._app.post('/lobby/:lobbyId/playerready', this._onLobbyPlayerReady.bind(this));
    this._app.post('/lobby/:lobbyId/playerunready', this._onLobbyPlayerUnready.bind(this));
  }

  private _onLobbyPlayerJoin(request: express.Request, response: express.Response) {
    console.log('[WEB] Got lobby player join data', request.params.lobbyId);
    this._io.lobbyPlayerJoin(request.params.lobbyId, request.body);

    response.sendStatus(200);
  }

  private _onLobbyPlayerLeave(request: express.Request, response: express.Response) {
    console.log('[WEB] Got lobby player leave data');
    this._io.lobbyPlayerLeave(request.params.lobbyId, request.body.playerId);

    response.sendStatus(200);
  }

  private _onLobbyPlayerReady(request: express.Request, response: express.Response) {
    console.log('[WEB] Got lobby player ready data');
    this._io.lobbyPlayerReady(request.params.lobbyId, request.body.playerId);

    response.sendStatus(200);
  }

  private _onLobbyPlayerUnready(request: express.Request, response: express.Response) {
    console.log('[WEB] Got lobby player unready data');
    this._io.lobbyPlayerUnready(request.params.lobbyId, request.body.playerId);

    response.sendStatus(200);
  }
}