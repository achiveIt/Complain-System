import mongoose from "mongoose";

const wardenSchema= mongoose.Schema(
    {
        name:{
            type:String,
            required: [true,"Kindly enter your Name"],
            toLowerCase: true
        },
        position:{
            type:String,
            enum: ['caretaker','warden'],
            required: [true,"Kindly select your position"],
            toLowerCase: true
        },
        phoneNo:{
            type:String,
            required: [true,"Kindly enter your Phone Numeber"],
        },
        email:{
            type:String,
            required: [true,"Kindly enter your Email"],
            toLowerCase: true
        },
        hostel:{
            type:String,
            enum: ['BH1','BH2','BH3','BH4','GH'], //required rakhnahai?
        
            toLowerCase: true
        }
    }, 
    {timeStamps: true}
)

export const Warden = mongoose.model("Warden", wardenSchema);