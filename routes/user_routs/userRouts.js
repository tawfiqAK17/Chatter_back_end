import express from 'express';
import { get_users } from '../../controllers/routsControllers/userControllers.js';
import { get_user } from '../../controllers/routsControllers/userControllers.js';

const user_route = express.Router();

// fetching users
user_route.get('/get-users', get_users)
user_route.get('/get-user', get_user)

export default user_route;
