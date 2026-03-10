import mongoose from "mongoose";

//connect to mongo Db
export const connectDB=async()=>{
    try{

        mongoose.connection.on('connected',()=>console.log('Database connected'));

        await mongoose.connect(`${process.env.MONGODB_URL}/chatAppDB`);
    }catch(error){

        console.log(error);

    }
}