import express, { Router } from "express";
import { getMessages } from "../../controllers/routsControllers/messagesControllers.js";
import authMiddleware from "../../middlewares/authenticationMiddleware.js";

//create the router
const messages_route = express.Router();

messages_route.post('/get-messages', authMiddleware, getMessages) 
export default messages_route
