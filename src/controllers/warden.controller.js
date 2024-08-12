import { Warden } from '../models/warden.model.js'
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js'
import { sendOtpVerificationMail, verifyOtp } from './otp.controller.js';

const checkStudentEmail = (email)=>{
    let regex= /^\d{2}[a-z]{3}\d{3}@lnmiit\.ac\.in$/;
    return regex.test(email);
}

const checkEmail = (email)=>{
    let regex = /^[a-zA-Z][a-zA-Z][a-zA-Z0-9._%+-]*@lnmiit\.ac\.in$/
    return regex.test(email);
}

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

    if(!checkStudentEmail(email)){
        throw new ApiError(400, "Kindly register through Student Register")  //useful?
    }

    if(!checkEmail(email)){
        throw new ApiError(400, "Email provided is not valid")
    }

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

const verifyWardenOtp = asyncHandler(async(req,res)=>{
    const {email , otp} = req.body

    const response = verifyOtp(email, otp);

    if(response){
        try {
            const newWarden = await Warden.findOne({email})
        
            if(!newWarden){
                throw new ApiError(500,"Error while fetching Warden")
            }
        
            newWarden.isVerified = true;
        
            await newWarden.save( {validateBeforeSave: false} );

            return res.status(200).json( 
                new ApiResponse(200,newWarden,"Warden registered Successfully!!")
            )
        } catch (error) {
            return res.status(500).json( 
                new ApiResponse(500,{},"Error while Email Verification")
            )    
        }
    }else{
        return res.status(200,{},"Wrong OTP")
    }
})

export{
    registerWarden,
    verifyWardenOtp
}