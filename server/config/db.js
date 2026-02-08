import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        const con = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log(`Database connected: ${con.connection.host}`);
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1)
    }
};

export default connectDB