import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import {Server} from 'socket.io';

const app=express();
const server=http.createServer(app);

//initialize socket.io
export const io=new Server(server,{
    cors:{origin:'*'}
});

//store online users
export const usersocketMap={}; //userId:socketId

//socket connection
io.on('connection',(socket)=>{
    const userId=socket.handshake.query.userId; //get userId from query
    console.log('User connected',userId);

    if(userId){
        usersocketMap[userId]=socket.id; //store userId and socketId in map
    }

    //emit online users all connected clients
    io.emit('getOnlineUsers',Object.keys(usersocketMap));

    socket.on('disconnect',()=>{
        console.log('User disconnected',userId);
        delete usersocketMap[userId]; //remove user from map on disconnect
        io.emit('getOnlineUsers',Object.keys(usersocketMap));
    })
});


//Middlewares
app.use(express.json({limit:'4mb'}));
app.use(cors()); //it allow url to connect backend

app.use('/api/status',(req,res)=>res.send("Server is Live...")); //api endpoint to test server
app.use('/api/auth',userRouter); //route for user authentication
app.use('/api/messages',messageRouter); //route for messages

//connect to mongo

await connectDB();

const PORT=process.env.PORT || 5000;

server.listen(PORT,()=>console.log(`Server is running on port ${PORT}`)); 