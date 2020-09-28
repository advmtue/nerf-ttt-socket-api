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
    this._app.post('/game/:gameId/playerjoin', this._onPlayerJoin.bind(this));
    this._app.post('/game/:gameId/playerleave', this._onPlayerLeave.bind(this));
    this._app.post('/game/:gameId/playerready', this._onPlayerReady.bind(this));
    this._app.post('/game/:gameId/playerunready', this._onPlayerUnready.bind(this));
    this._app.post('/game/:gameId/launched', this._onLaunch.bind(this));

    // Game
    this._app.post('/game/:gameId/confirmkills', this._onConfirmKillList.bind(this));
    this._app.post('/game/:gameId/started', this._onStart.bind(this));
    this._app.post('/game/:gameId/ended', this._onEnd.bind(this));
    this._app.delete('/game/:gameId', this._onClose.bind(this));

    this._app.post('/game/:gameId/confirmKill/:playerId', this._playerConfirmKill.bind(this));
  }

  private _onPlayerJoin(request: express.Request, response: express.Response) {
    console.log('[WEB] Got game player join data', request.params.gameId);
    this._io.playerJoin(request.params.gameId, request.body);

    response.sendStatus(200);
  }

  private _onPlayerLeave(request: express.Request, response: express.Response) {
    console.log('[WEB] Got game player leave data');
    this._io.playerLeave(request.params.gameId, request.body.playerId);

    response.sendStatus(200);
  }

  private _onPlayerReady(request: express.Request, response: express.Response) {
    console.log('[WEB] Got game player ready data');
    this._io.playerReady(request.params.gameId, request.body.playerId);

    response.sendStatus(200);
  }

  private _onPlayerUnready(request: express.Request, response: express.Response) {
    console.log('[WEB] Got game player unready data');
    this._io.playerUnready(request.params.gameId, request.body.playerId);

    response.sendStatus(200);
  }

  private _onClose(request: express.Request, response: express.Response) {
    console.log('[WEB] Got game close request :', request.params.gameId);
    this._io.gameClose(request.params.gameId);

    response.sendStatus(200);
  }

  private _onLaunch(request: express.Request, response: express.Response) {
    console.log(`[WEB] Got game launch request :${request.params.gameId}`);
    this._io.gameLaunch(request.params.gameId, request.body.gameId);

    response.sendStatus(200);
  }

  private _onStart(request: express.Request, response: express.Response) {
    console.log(`[WEB] Got game start request :${request.params.gameId}`);
    this._io.gameStart(request.params.gameId);

    response.sendStatus(200);
  }

  private _onEnd(request: express.Request, response: express.Response) {
    console.log(`[WEB] Got game end request :${request.params.gameId}`);
    this._io.gameEnd(request.params.gameId, request.body);

    response.sendStatus(200);
  }

  private _onConfirmKillList(request: express.Request, response: express.Response) {
    console.log(`[WEB] Got game confirm kills request :${request.params.gameId}`);
    this._io.confirmKills(request.params.gameId, request.body);

    response.sendStatus(200);
  }

  private _playerConfirmKill(request: express.Request, response: express.Response) {
    console.log(`[WEB] Got player confirm kill request :${request.params.gameId}::${request.params.playerId}`);
    this._io.playerConfirmKill(request.params.gameId, request.params.playerId);

    response.sendStatus(200);
  }
}