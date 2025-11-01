import { Server } from "socket.io";
import express from "express";
import http from 'http';

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:'https://nexaconnect.vercel.app',
        methods:['GET', 'POST'],
        credentials: true
    }
})

const userSocketMap = {} // This map stores the socket id corresponding to the user id like UserId --> SocketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket)=>{
    const userId = socket.handshake.query.userId;
    // console.log("New socket connection:", userId, socket.id); 
    if(userId){
        userSocketMap[userId] = socket.id;
        // console.log(`User Connected: UserId = ${userId}, SocketId = ${socket.id}`);
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect',()=>{
        if(userId){
            // console.log(`User disconnected: UserId = ${userId}, SocketId = ${socket.id}`);
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
})

export {app, server, io};
