import express from 'express';
import cors from 'cors'
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
import sign_in_up_route from './routes/authRoutes.js';
import user_route from './routes/user_routs/userRouts.js';
import { InitWebSocket, WebSocketEventListener } from './controllers/webSocketControllers.js';
import messages_route from './routes/user_routs/MessagesRouts.js';

// .env config
configDotenv();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const FRONT_END_URLS = [process.env.FRONT_END_URL1, process.env.FRONT_END_URL2];

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: FRONT_END_URLS,
}));

app.use(express.json());
app.use(cookieParser());

// Serve static files from the React app's build directory
const buildPath = path.join(__dirname, '../Front-end/dist');
app.use(express.static(buildPath));


//connect to db
mongoose.connect(MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err))
//define the user schema

// Start the server
const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

//user authentication
app.post('/sign-in', sign_in_up_route);

//adding new user
app.post('/sign-up', sign_in_up_route);

// handling the user requests 
app.use('/user', user_route);

// handling the messages requests
app.use('/messages', messages_route);

// Serve index.html for all frontend routes
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// creating a web socket
const io = InitWebSocket(server);

// listening for the websocket events 
WebSocketEventListener(io);
