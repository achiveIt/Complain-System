import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const studentSchema = new Schema(
    {
        name:{
            type: String,
            required: [true,"Kindly enter your Name"],
            lowercase: true,
            trim: true         
        },
        rollNo:{
            type: String,
            required: [true,"Kindly enter your Roll Number"],
            lowercase: true,
            unique: true,
            trim: true
        },
        email:{
            type: String,
            required: [true,"Kindly enter your Email"],
            lowercase: true,
            unique: true,
            trim: true
        },
        phoneNo:{
            type: String,
            required: [true,"Kindly enter your Phone Numeber"],
            trim: true
        },
        password:{
            type: String,
            reuired: [true, 'Password is required'],
            trim: true
        },
        refreshToken:{
            type: String
        },
        isVerified:{
            type: Boolean,
            default: false,
            required: true
        }
    }, 
    {
        timeStamps: true
    }
)

studentSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 8);
    next()
})

studentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

studentSchema.methods.generateAccessToken = function(){
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

studentSchema.methods.generateRefreshToken = function(){
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

export const Student = mongoose.model("Student", studentSchema);