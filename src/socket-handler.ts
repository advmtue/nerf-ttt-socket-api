import SocketMessage from './types/SocketMessage';

export default class SocketHandler {
  private _io: SocketIO.Server;

  constructor(io: SocketIO.Server) {
    this._io = io;

    this._catchConnections();
  }

  private _catchConnections() {
    this._io.on('connection', this._registerRoutes.bind(this));
  }

  private _registerRoutes(socket: SocketIO.Socket): void {
    console.log('[SOCKET] Caught new socket connection');

    socket.on('joinGame', (data: { gameId: string }) => {
      console.log(`[SOCKET] Socket joined game :${data.gameId}`);
      socket.join(`GAME#${data.gameId}`);
    });

    socket.on('leaveGame', (data: { gameId: string }) => {
      console.log(`[SOCKET] Socket left game :${data.gameId}`);
      socket.leave(`GAME#${data.gameId}`);
    });

    socket.on('disconnect', () => {
      console.log('[SOCKET] A socket disconnected');
    });
  }

  public playerJoin(gameCode: string, playerInfo: string): void {
    const payload: SocketMessage = {
      scopeId: gameCode,
      payload: playerInfo,
    };

    this._io.to(`GAME#${gameCode}`).emit('gamePlayerJoin', payload);
  }

  public playerLeave(gameCode: string, playerInfo: string): void {
    const payload: SocketMessage = {
      scopeId: gameCode,
      payload: playerInfo,
    };

    this._io.to(`GAME#${gameCode}`).emit('gamePlayerLeave', payload);
  }

  public playerReady(gameCode: string, playerId: string): void {
    const payload: SocketMessage = {
      scopeId: gameCode,
      payload: playerId
    };

    this._io.to(`GAME#${gameCode}`).emit('gamePlayerReady', payload);
  }

  public playerUnready(gameCode: string, playerId: string): void {
    const payload: SocketMessage = {
      scopeId: gameCode,
      payload: playerId
    };

    this._io.to(`GAME#${gameCode}`).emit('gamePlayerUnready', payload);
  }

  public gameClose(gameCode: string): void {
    const payload: SocketMessage = {
      scopeId: gameCode,
      payload: 'close',
    };

    this._io.to(`GAME#${gameCode}`).emit('gameClose', payload);
  }

  public gameLaunch(gameCode: string, gameId: string): void {
    const payload: SocketMessage = {
      scopeId: gameCode,
      payload: gameId,
    };

    this._io.to(`GAME#${gameCode}`).emit('gameLaunch', payload);
  }

  public gameStart(gameId: string): void {
    const payload: SocketMessage = {
      scopeId: gameId,
      payload: 'start'
    };

    this._io.to(`GAME#${gameId}`).emit('gameStart', payload);
  }

  public gameEnd(gameId: string, endGameInfo: any): void {
    const payload: SocketMessage = {
      scopeId: gameId,
      payload: endGameInfo
    };

    this._io.to(`GAME#${gameId}`).emit('gameEnd', payload);
  }

  public confirmKills(gameId: string, toConfirm: any): void {
    const payload: SocketMessage = {
      scopeId: gameId,
      payload: toConfirm
    };

    this._io.to(`GAME#${gameId}`).emit('confirmKills', payload);
  }

  public playerConfirmKill(gameId: string, victimId: string): void {
    const payload: SocketMessage = {
      scopeId: gameId,
      payload: victimId
    };

    this._io.to(`GAME#${gameId}`).emit('playerConfirmKill', payload);
  }
}