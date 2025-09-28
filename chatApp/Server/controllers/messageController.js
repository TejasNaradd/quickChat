import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {io,usersocketMap} from "../server.js";

//get all user except logeed in user
export const getUsersForSideBar=async(req,res)=>{
    try{
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password"); //ne means not equal to, -password means exclude password

        //count of unseen messages from each user
        const unseenMessage={};
        const promises=filteredUsers.map(async(user)=>{
            const messages=await Message.find({senderId:user._id,receiverId:userId,seen:false});
            if(messages.length>0){
                unseenMessage[user._id]=messages.length; //no. of unseen msgs from each user
            }                     
        });
        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenMessage});  
    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

//get all meesage for selected user
export const getMessages=async(req,res)=>{
    try{
        const {id:selectedUserId}=req.params; //id of selected user
        const myId=req.user._id; //logged in user id

        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId}
            ]
        })
        await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true}); //mark all msgs as seen 
        res.json({success:true,messages});
    } 
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}
//api to mark msgs as seen when user opens chat
export const markMessagesAsSeen=async(req,res)=>{
    try{
        const {id}=req.params; //id of selected user
        await Message.findByIdAndUpdate({id},{seen:true});
        res.json({success:true});
    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
} 

//send msg to selected user
export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
        const receiverId=req.params.id; //id of selected user
        const senderId=req.user._id; //logged in user id

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save();

        //emit new msg to receiver if online
        const receiverSocketId=usersocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage);
        }

        res.json({success:true,newMessage});

    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}