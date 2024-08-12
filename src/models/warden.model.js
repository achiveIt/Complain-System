import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { type } from "os";

const wardenSchema= new Schema(
    {
        name:{
            type: String,
            required: [true,"Kindly enter your Name"],
            toLowerCase: true
        },
        position:{
            type: String,
            enum: ['caretaker','warden'],
            required: [true,"Kindly select your position"],
            toLowerCase: true,
        },
        phoneNo:{
            type: String,
            required: [true,"Kindly enter your Phone Numeber"],
        },
        email:{
            type: String,
            required: [true,"Kindly enter your Email"],
            toLowerCase: true,
            unique: true
        },
        hostel:{
            type: String,
            enum: ['BH1','BH2','BH3','BH4','GH'], 
            reuired: true,
            toLowerCase: true
        },
        password:{
            type: String,
            reuired: [true, 'Password is required']
        },
        isVerified:{
            type: Boolean,
            default: false,
            required: true
        },
        refreshToken:{
            type: String
        }
    }, 
    {timeStamps: true}
)

wardenSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 8)
    next()
})

wardenSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

wardenSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

wardenSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Warden = mongoose.model("Warden", wardenSchema);