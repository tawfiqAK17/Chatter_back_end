import express, { Router } from "express";
import { getMessages } from "../../controllers/routsControllers/messagesControllers.js";

//create the router
const messages_route = express.Router();

messages_route.post('/get-messages', getMessages) 
export default messages_route
