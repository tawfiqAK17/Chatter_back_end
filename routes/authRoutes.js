import { signInController, signUpController } from '../controllers/authControllers.js';
import express from 'express';

const sign_in_up_route = express.Router();


// user authentication
sign_in_up_route.post('/sign-in', signInController);

//adding new user
sign_in_up_route.post('/sign-up', signUpController);

export default sign_in_up_route;
