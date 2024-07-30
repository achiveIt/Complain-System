import mongoose from "mongoose";


const otpScema= mongoose.Schema({
    email:{
        type:String,
        required:true,
        toLowerCase:true
    },
    otpGenerated:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 60 * 5  //5mins
    }
})


