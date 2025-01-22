import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const users = [
    {
        name: 'user1',
        password: '1'
    }
]

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Add this line to parse JSON bodies
app.use(express.json());

// Serve static files from the React app's build directory
const buildPath = path.join(__dirname, '../Front-end/dist');
app.use(express.static(buildPath));

// Serve index.html for all frontend routes
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

//user authentication
app.post('/sign-in', (req, res) => {
    const { name, password } = req.body;

    // Use find to look for the user
    const user = users.find(user => user.name === name);
    if (user && user.password === password) {
        return res.send('true'); // Send 'true' when user is found and credentials match
    }
    res.send('false'); // Send 'false' when user not found or credentials don't match
});
