import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSideBar, markMessagesAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter=express.Router();

messageRouter.get('/users',protectRoute,getUsersForSideBar); //get used because we have to fetch users
messageRouter.get('/:id',protectRoute,getMessages); //get used because we have to fetch msgs
messageRouter.put('/mark/:id',protectRoute,markMessagesAsSeen);//put used because we have to update msgs as seen
messageRouter.post('/send/:id',protectRoute,sendMessage); //post used because we have to send msgs

export default messageRouter;