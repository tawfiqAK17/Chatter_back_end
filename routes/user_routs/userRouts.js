import express from 'express';
import { get_users } from '../../controllers/routsControllers/userControllers.js';
import { get_user } from '../../controllers/routsControllers/userControllers.js';
import authMiddleware from '../../middlewares/authenticationMiddleware.js';

const user_route = express.Router();

// fetching users
user_route.get('/get-users', authMiddleware, get_users)
user_route.get('/get-user', authMiddleware, get_user)

export default user_route;
