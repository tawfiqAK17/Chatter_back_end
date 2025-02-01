import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
import sign_in_up_route from './routes/authRoutes.js';
import jwt from 'jsonwebtoken';


// .env config
configDotenv();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());

// Serve static files from the React app's build directory
const buildPath = path.join(__dirname, '../Front-end/dist');
app.use(express.static(buildPath));

// Serve index.html for all frontend routes
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

//connect to db
mongoose.connect(MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err))
//define the user schema

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// check if the user is authenticated
app.post('/check-auth', (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            res.json({isAuth: jwt.verify(token, process.env.JWT_SECRET_STRING) ? true : false});
        } 
    } catch (err) {
        res.json({isAuth: false});
    }
});

//user authentication
app.post('/sign-in', sign_in_up_route);

//adding new user
app.post('/sign-up', sign_in_up_route);
