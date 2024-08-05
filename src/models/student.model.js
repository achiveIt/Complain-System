import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const studentSchema = new Schema(
    {
        name:{
            type:String,
            required: [true,"Kindly enter your Name"],
            toLowerCase: true         
        },
        rollNo:{
            type:String,
            required: [true,"Kindly enter your Roll Number"],
            toLowerCase: true
        },
        email:{
            type:String,
            required: [true,"Kindly enter your Email"],
            toLowerCase: true
        },
        phoneNo:{
            type:String,
            required: [true,"Kindly enter your Phone Numeber"],
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

studentSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 8);
    next()
})

studentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const Student = mongoose.model("Student", studentSchema);