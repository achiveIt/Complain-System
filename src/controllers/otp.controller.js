import {Otp} from "../models/otp.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import mailSender from '../utils/MailSender.js';
import bcrypt from 'bcrypt'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'

const sendOtpVerificationMail= asyncHandler(async(req,res)=>{
    const {email}= req.body;

    const otpGenerated = `${Math.floor(1000 + Math.random()*9000)}`;

    const hashedOtp= await bcrypt(otpGenerated,8);

    const newOtp= await Otp.create({
        email,
        otpGenerated:hashedOtp,
        expiresAt: Date.now() + (5*60000)
    })

    if(!newOtp){
        throw new ApiError(500,"Error while saving Otp")
    }

    try {
        const title= "Email Verfication";
        const body= `<h1>Please confirm your Email</h1>
                     <p>Here is your Otp Code: ${otp}`

        const mailResponse = mailSender(email,title,body);
         
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }

    res.status(200).json(
        new ApiResponse(200,{},"Otp Verification Mail Send!!")
    )
})

const verifyOtp = asyncHandler(async(req,res)=>{
    const {email,otp}= req.body

    const checkOtp = await Otp.findOne({
        email
    })

    if(!checkOtp){
        throw new ApiError(400,"Email is not yet registered!!");
    }

    const currentTime= Date.now();
    const expiryTime= checkOtp.expiresAt;

    if(expiryTime<currentTime){
        return res.status(200).json(
            new ApiResponse(200,{},"Otp Expired!! Regenerate Otp Verfication Mail ")
        )
        // throw new ApiError(400,"Otp is expired")
    }

    const hashedOtp = checkOtp.expiresAt;
    const isCorrectOtp = await bcrypt.compare(otp,hashedOtp);

    if(!isCorrectOtp){
        throw new ApiError(400,"OTP provided is wrong!!")
    }

    //user verified
    await Otp.deleteMany({
        email
    })

    return res.status(200).json(
        new ApiResponse(200,{},"User Successfully Verified")
    )

})


export {
    sendOtpVerificationMail,
    verifyOtp
}