import { Server } from 'socket.io'
import jwt from 'jsonwebtoken';
import { creatMessage } from './modelsControllers/messsageModelControllers.js';
import socketStore from './socketStore.js';


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

    // the authorization header
    const authHeader = socket.handshake.auth.token;

    if (authHeader) {
        // extracting the actual jwt 
        const token = authHeader.split(' ')[1];

        // verifying the authentication token
        jwt.verify(token.replaceAll('"', ''), process.env.JWT_SECRET_STRING, (err, user) => {
                if (user) {
                    socket.user = user;
                    // adding the socket to the currently connected users
                    socketStore.addSocket(user.id, socket.id);

                    socket.on('msg', (msg) => {
                        msgEventHandler(socket, msg, io);
                    })
                    socket.on('disconnect', () => {
                        socketStore.removeSocket(user.id);
                    })
                } else {
                    console.log(err);
                }
            });
        }
    })
}

//msg event handler
const msgEventHandler = async (socket, msg, io) => {
    const sender_id = socket.user.id;
    try {
        const message = await creatMessage(msg.content, sender_id, msg.receiverId, new Date().toString());
        const sender_socket_id = socketStore.getSocketId(sender_id);
        if (socketStore.isConnected(msg.receiverId)) {
            const receiver_socket_id = socketStore.getSocketId(msg.receiverId);
            io.sockets.sockets.get(receiver_socket_id).emit('update_messages', message);
        }
        io.sockets.sockets.get(sender_socket_id).emit('update_messages', message);
        

    } catch (err) {
        console.log(err);
    }
}
