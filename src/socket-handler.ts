import SocketMessage from './types/SocketMessage';

export default class SocketHandler {
  private _io: SocketIO.Server;

  constructor (io: SocketIO.Server) {
    this._io = io;

    this._catchConnections();
  }

  private _catchConnections() {
    this._io.on('connection', this._registerRoutes.bind(this));
  }

  private _registerRoutes(socket: SocketIO.Socket): void {
    console.log('[SOCKET] Caught new socket connection');

    socket.on('joinLobby', (data: {lobbyId: string}) => {
      console.log(`[SOCKET] Socket joined lobby :${data.lobbyId}`);
      socket.join(`LOBBY#${data.lobbyId}`);
    });

    socket.on('leaveLobby', (data: {lobbyId: string}) => {
      console.log(`[SOCKET] Socket left lobby :${data.lobbyId}`);
      socket.leave(`LOBBY#${data.lobbyId}`);
    });

    socket.on('joinGame', gameId => {
      console.log(`[SOCKET] Socket joined game :${gameId}`);
    });

    socket.on('leaveGame', gameId => {
      console.log(`[SOCKET] Socket left game :${gameId}`);
    });
  }

  public lobbyPlayerJoin(lobbyCode: string, playerInfo: string): void {
    const payload: SocketMessage = {
      scopeId: lobbyCode,
      payload: playerInfo,
    };
  
    this._io.to(`LOBBY#${lobbyCode}`).emit('lobbyPlayerJoin', payload);
  }

  public lobbyPlayerLeave(lobbyCode: string, playerInfo: any): void {
    const payload: SocketMessage = {
      scopeId: lobbyCode,
      payload: playerInfo,
    };

    this._io.to(`LOBBY#${lobbyCode}`).emit('lobbyPlayerLeave', payload);
  }

  public lobbyPlayerReady(lobbyCode: string, playerId: string): void {
    const payload: SocketMessage = {
      scopeId: lobbyCode,
      payload: playerId
    };

    this._io.to(`LOBBY#${lobbyCode}`).emit('lobbyPlayerReady', payload);
  }

  public lobbyPlayerUnready(lobbyCode: string, playerId: string): void {
    const payload: SocketMessage = {
      scopeId: lobbyCode,
      payload: playerId
    };

    this._io.to(`LOBBY#${lobbyCode}`).emit('lobbyPlayerUnready', payload);
  }
}