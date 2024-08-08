import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDb = async()=>{
    try {
        const connectionInst = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

        console.log(`\n MongoDb Connected!! DB Host: ${connectionInst.connection.host}`);
    } catch (error) {
        console.log(`MONGODB CONNECTION ERROR!!`, error);
        process.exit(1);
    }
}

export default connectDb