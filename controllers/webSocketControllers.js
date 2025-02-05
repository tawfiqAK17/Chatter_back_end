import { Server } from 'socket.io'

// the websocket initializing
export function InitWebSocket(server) {
    const FRONT_END_URL = process.env.FRONT_END_URL;
    const io = new Server(server, {
        cors: {
            origin: FRONT_END_URL, 
            credentials: true,
        }
    });
    return io;
}

// websocket event listener
export function WebSocketEventListener(io) {
    io.on('connection', (socket) => {
        socket.on('msg', (msg) => {
            console.log(msg);
        })
    })
}
