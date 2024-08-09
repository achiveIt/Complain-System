import { Warden } from '../models/warden.model.js'
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js'
import { sendOtpVerificationMail } from './otp.controller.js';

const registerWarden = asyncHandler(async(req,res)=>{
    const {name,position,phoneNo,email,hostel,password}= req.body;

    if(
        [name, position, phoneNo, email, hostel].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    if(phoneNo.length != 10){
        throw new ApiError(400, "Phone Number must be 10 digits long")
    }

    //email field check on what basis??

    if(!password || password.trim() === ""){
        throw new ApiError(400,"Password field cannot be empty")
    }

    const checkUser = await Warden.findOne({email});

    if(checkUser){
        throw new ApiError(400, "User already exists. Kindly Sign In")
    }

    const newUser = new Warden({
        name,
        position,
        phoneNo,
        email,
        hostel,
        password
    })

    await newUser.save()

    await sendOtpVerificationMail(email);

    return res.status(200).json(
        new ApiResponse(200,{},"Email Verification Mail Sent!!")
    )
})


export{
    registerWarden
}