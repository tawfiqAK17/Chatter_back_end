import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { configDotenv } from 'dotenv';
import { error } from 'console';

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
const userSchema = new mongoose.Schema({
    name: String, 
    email: String,
    password_SHA: String
});
// create a model
const userModel = mongoose.model('user', userSchema);

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

//user authentication
app.post('/sign-in', async (req, res) => {
    try {
        const { name, password } = req.body;

        // Use find to look for the user
        const user = userModel.find(user => user.name === name);
        if (user && user.password_SHA === password) {
            return res.send('true'); // Send 'true' when user is found and credentials match
        }
        res.status(400).send('false'); // Send 'false' when user not found or credentials don't match

    } catch (error) {
        res.status(500).send();
        console.log(error);
    }
});

//adding new user
app.post('/sign-up', async (req, res) => {
    try {
        const new_user = req.body;
        // duplicate name are not allowed
        if(await userModel.countDocuments({name: new_user.name}) > 0) {
            return res.send('taken user name');
        }
        // adding the new user
        await userModel.create({
            name: new_user.name,
            email: new_user.email,
            // save the password hash
            password_SHA: await bcrypt.hash(new_user.password, await bcrypt.genSalt()),
        });
        res.status(201).send('user added')
    } catch (error) {
        res.status(500).send();
        console.log(error);
    }
})
