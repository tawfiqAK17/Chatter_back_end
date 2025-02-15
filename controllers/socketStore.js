
class SocketStore {
    constructor() {
        this._sockets = new Map();
    }

    addSocket(user_id, socket) {
        this._sockets.set(user_id, socket);
    }

    removeSocket(user_id) {
        this._sockets.delete(user_id);
    }
    
    isConnected(user_id) {
        return this._sockets.has(user_id);
    } 

    getSocketId(user_id) {
        return this._sockets.get(user_id);
    }
}

export default new SocketStore();
