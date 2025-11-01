import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import useRoute from './routers/user.route.js'
import postRouter from './routers/post.router.js'
import messageRouter from './routers/messages.router.js'
import { app, server } from "./socket/socket.js";
dotenv.config({});


// const app = express();  After Socket.io we will import app from ./socket/socket.js

const PORT = process.env.PORT || 3000;

app.get('/',(_,res)=>{
    return res.status(200).json({
        message:"Comming from backend",
        success:true
    })
})

//middlerwares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOption = {
  origin: 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOption));

// const PORT = 3000;   Remove it to add it from .env file

//Add api here
app.use("/api/v2/user",useRoute);
app.use("/api/v2/post",postRouter);
app.use("/api/v2/message",messageRouter);

server.listen(PORT,()=>{
    connectDB();
    console.log(`Server listen at port ${PORT}...`);
})