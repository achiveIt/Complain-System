import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

export const Warden = mongoose.model("Warden", wardenSchema);