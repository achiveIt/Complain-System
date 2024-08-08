import mongoose, {Schema} from "mongoose";

const otpSchema = new Schema({
    email:{
        type: String,
        required: true,
        toLowerCase: true
    },
    otpGenerated:{
        type: String,
        required: true
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

export const Otp = mongoose.model("Otp",otpSchema);

