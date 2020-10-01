import SocketMessage from './types/SocketMessage';

export default class SocketHandler {
  private _io: SocketIO.Server;

  constructor(io: SocketIO.Server) {
    this._io = io;

    // Configure route associations
    this._io.on('connection', this._registerRoutes.bind(this));
  }

  /**
   * Handle route associations for new socket connections.
   *
   * @param socket A new socket which has recently connected
   */
  private _registerRoutes(socket: SocketIO.Socket): void {
    socket.on('joinGame', (data: { gameId: string }) => {
      console.log(`[SOCKET] Socket joined game :${data.gameId}`);
      socket.join(`GAME#${data.gameId}`);
    });

    socket.on('leaveGame', (data: { gameId: string }) => {
      console.log(`[SOCKET] Socket left game :${data.gameId}`);
      socket.leave(`GAME#${data.gameId}`);
    });
  }

  /**
   * Build a SocketMessage from scopeId and payload.
   * Helper function to reduce duplicate code throughout
   *
   * @param scopeId Scope ID (GameId/PlayerId)
   * @param payload Payload information
   * @returns {SocketMessage} A built SocketMessage
   */
  // eslint-disable-next-line
  private _buildSocketMessage(scopeId: string, payload: any): SocketMessage {
    return { scopeId, payload } as SocketMessage;
  }

  /**
   * When a player joins a game, notify all other players their player information.
   *
   * @param gameCode Game Code
   * @param playerInfo Player unique ID
   */
  // TODO Build types for 'playerInfo' to remove explicity any
  // eslint-disable-next-line
  public playerJoin(gameCode: string, playerInfo: any): void {
    this._io.to(`GAME#${gameCode}`).emit('gamePlayerJoin', this._buildSocketMessage(gameCode, playerInfo));
  }

  /**
   * When a player leaves a game, notify all other players of their userId.
   * Only userId is required as the clients can filter their player lists by unique ID
   *
   * @param gameCode Game code
   * @param playerId Player unique ID
   */
  public playerLeave(gameCode: string, playerId: string): void {
    this._io.to(`GAME#${gameCode}`).emit('gamePlayerLeave', this._buildSocketMessage(gameCode, playerId));
  }

  /**
   * When player readies up, notify other players in the lobby of their unique ID.
   * Only unique ID is required, as clients should already have a consistent player list.
   *
   * @param gameCode Game code
   * @param playerId Player unique ID
   */
  public playerReady(gameCode: string, playerId: string): void {
    this._io.to(`GAME#${gameCode}`).emit('gamePlayerReady', this._buildSocketMessage(gameCode, playerId));
  }

  /**
   * When a player sets their status to unready, notify other players in the lobby of their unique ID.
   * Only unique ID is required, as clients should already have a consistent player list.
   *
   * @param gameCode Game code
   * @param playerId Player unique ID
   */
  public playerUnready(gameCode: string, playerId: string): void {
    this._io.to(`GAME#${gameCode}`).emit('gamePlayerUnready', this._buildSocketMessage(gameCode, playerId));
  }

  /**
   * When a game closes -- for any reason -- notify players in the game that the game is no longer available.
   *
   * @param gameCode Game code
   */
  public gameClose(gameCode: string): void {
    this._io.to(`GAME#${gameCode}`).emit('gameClose', this._buildSocketMessage(gameCode, 'close'));
  }

  /**
   * When a game launches (ie. LOBBY -> PREGAME) notify players of the change .
   *
   * @param gameCode Game code
   */
  public gameLaunch(gameCode: string): void {
    this._io.to(`GAME#${gameCode}`).emit('gameLaunch', this._buildSocketMessage(gameCode, 'launch'));
  }

  /**
   * When a game starts (ie. PREGAME -> INGAME) notify players of the change.
   * We also forward startTime so that postgame kill logs have a point of reference.
   *
   * @param gameCode Game code
   * @param startTime Starting time (UnixTimeMilliseconds)
   */
  public gameStart(gameCode: string, startTime: string): void {
    this._io.to(`GAME#${gameCode}`).emit('gameStart', this._buildSocketMessage(gameCode, startTime));
  }

  /**
   * When a game ends (ie. {INGAME,POSTPENDING} -> POSTGAME) notify players of the endgame information.
   *
   * @param gameCode Game code
   * @param endGameInfo End of game information
   */
  // TODO Build types for 'endGameInfo' to remove explicit any
  // eslint-disable-next-line
  public gameEnd(gameCode: string, endGameInfo: any): void {
    this._io.to(`GAME#${gameCode}`).emit('gameEnd', this._buildSocketMessage(gameCode, endGameInfo));
  }

  /**
   * When a game ends into pending (ie. INGAME -> POSTPENDING) notify players of the players who need to provide
   * further kill information (ie. Players who have registered an 'unknown' killer).
   *
   * @param gameCode Game code
   * @param toConfirm Player list of those who need to confirm their kill
   */
  // TODO Build types for 'toConfirm' to remove explicit any
  // eslint-disable-next-line
  public confirmKills(gameCode: string, toConfirm: any): void {
    this._io.to(`GAME#${gameCode}`).emit('confirmKills', this._buildSocketMessage(gameCode, toConfirm));
  }

  /**
   * When a player confirms their kill in POSTPENDING phase, notify other players so that they can update
   * their 'waitingFor' lists.
   *
   * @param gameCode Game code
   * @param victimId Player who is confirming the kill
   */
  public playerConfirmKill(gameCode: string, victimId: string): void {
    this._io.to(`GAME#${gameCode}`).emit('playerConfirmKill', this._buildSocketMessage(gameCode, victimId));
  }
}
