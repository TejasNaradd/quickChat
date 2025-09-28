import jwt from "jsonwebtoken";   

//func to create a token
export const createToken=(userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET);
    return token;
}