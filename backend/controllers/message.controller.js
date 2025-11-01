import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// TO SEND MESSAGE
export const sendMessage = async(req, res)=>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage: messages } = req.body;
        // console.log(messages)

        // // Log inputs for debugging
        // console.log("Request body:", req.body);
        // console.log("Sender ID:", senderId);
        // console.log("Receiver ID:", receiverId);


        if (!messages || !messages.trim()) {
            return res.status(400).json({
                success: false,
                error: "Message cannot be empty"
            });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // established conversation if not started yet
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            messages
        });

        if(newMessage){
            conversation.message.push(newMessage._id);
        }

        // await conversation.save();
        // await newMessage.save();
                 //OR

        await Promise.all([conversation.save(), newMessage.save()]);

        // implement the socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(200).json({
            success:true,
            newMessage
        });

    } catch (error) {
        // console.log(error);
        console.error("SendMessage Error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

//TO GET MESSAGE
export const getMessage = async(req,res)=>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        // const conversation = await Conversation.findOne({
        //     participants: { $all: [senderId, receiverId] }
        // }).populate({
        //     path: 'messages', // ⬅️ Make sure this matches the field name in your schema
        //     populate: {
        //         path: 'senderId receiverId',
        //         select: 'username profilePicture' // You can customize fields
        //     }
        // });
        const conversation = await Conversation.findOne({
            participants:{$all: [senderId, receiverId]}
        }).populate('message')


        if(!conversation){
            return res.status(200).json({
                success:true,
                messages:[]
            });
        }
        return res.status(200).json({
            success:true,
            messages: conversation?.message
        });

    } catch (error) {
        // console.log(error);
        console.error("getMessage error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};