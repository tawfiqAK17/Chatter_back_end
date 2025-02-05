import express from 'express';
import { get_users } from '../../controllers/userControllers.js';

const user_route = express.Router();

// fetching users
user_route.get('/get-users', get_users)

export default user_route;
