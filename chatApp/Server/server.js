import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import {Server} from 'socket.io';

const app = express();
const server = http.createServer(app);

// initialize socket.io
export const io = new Server(server, {
    cors: { origin: '*' }
});

// store online users
export const usersocketMap = {}; // userId:socketId

// socket connection
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User connected', userId);

    if (userId) {
        usersocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(usersocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected', userId);
        delete usersocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(usersocketMap));
    });
});

// Middlewares
app.use(express.json({ limit: '4mb' }));
app.use(cors());

app.use('/api/status', (req, res) => res.send("Server is Live..."));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

// ✅ start server
const startServer = async () => {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

startServer();