import mongoose, {Schema} from "mongoose";

const tokenSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    tokenGenerated: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60  //seconds
    }    
})

export const token = mongoose.model("token", tokenSchema)