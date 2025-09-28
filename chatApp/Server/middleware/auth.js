//before executing userController

import User from "../models/User.js";
import jwt from "jsonwebtoken";

//next will execute the userController
export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.headers.token; ///token from frontend
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password"); //-password means exclude password

        if(!user){
            return res.json({success:false,message:"User not found"});
        }

        req.user=user; //add user to req object
        next(); //execute userController

    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}