import { Server } from 'socket.io'
import jsonwebtoken from 'jsonwebtoken';
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

        // Parse jwt token 
        const cookies_string = socket.request.headers.cookie;
        if (cookies_string) {
            const cookies = socket.request.headers.cookie.split('; ');
            const jwtToken = cookies.find(cookie => cookie.startsWith('jwt='));
            const user_id = jsonwebtoken.decode(jwtToken.substring(4)).id;

            // adding the socket to the currently connected users
            socketStore.addSocket(user_id, socket.id);

            socket.on('msg', (msg) => {
                msgEventHandler(socket, msg, io);
            })
            socket.on('disconnect', () => {
                socketStore.removeSocket(user_id);
            })
        }
    })
}

//msg event handler
const msgEventHandler = async (socket, msg, io) => {
    // Parse jwt token 
    const cookies = socket.request.headers.cookie.split('; ');
    const jwtToken = cookies.find(cookie => cookie.startsWith('jwt='));

    // adding the message to the data base
    const sender_id = jsonwebtoken.decode(jwtToken.substring(4)).id;
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
