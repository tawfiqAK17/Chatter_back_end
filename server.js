import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { configDotenv } from 'dotenv';
import sign_in_up_route from './routes/SignInUpRoutes.js';

// .env config
configDotenv();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

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

//user authentication
app.post('/sign-in', sign_in_up_route);

//adding new user
app.post('/sign-up', sign_in_up_route);
