import mongoose, {Schema} from "mongoose";

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
        }
    }, 
    {timeStamps: true}
)

export const Student = mongoose.model("Student", studentSchema);