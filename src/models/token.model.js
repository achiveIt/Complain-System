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
    expiresAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 5 * 60000
    },
    createdAt: {
        type: Date
    }     
})

export const Token = mongoose.model("Token", tokenSchema)