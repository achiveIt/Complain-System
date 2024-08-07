import {Otp} from "../models/otp.model.js";
import mailSender from '../utils/MailSender.js';
import bcrypt from 'bcrypt'
import ApiError from '../utils/ApiError.js'

const sendOtpVerificationMail = async(email)=>{

    const otpGenerated = `${Math.floor(1000 + Math.random()*9000)}`;

    const hashedOtp =  await bcrypt.hash(otpGenerated, 8);

    const newOtp = await Otp.create({
        email,
        otpGenerated:hashedOtp,
        expiresAt: Date.now() + (5*60000)
    })

    if(!newOtp){
        throw new ApiError(500,"Error while generating OTP")
    }

    try {
        const title= "Email Verfication";
        const body= `<h1>Please confirm your Email</h1>
                     <p>Here is your Otp Code: ${otpGenerated}`

        const mailResponse = mailSender(email,title,body);
         
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

const verifyOtp = async(email,otp)=>{
    const checkOtp = await Otp.findOne({
        email
    })

    if(!checkOtp){
        throw new ApiError(400,"Email is not yet registered!!");
    }

    const currentTime = Date.now();
    const expiryTime  = checkOtp.expiresAt;

    if(expiryTime < currentTime){
        throw new ApiError(400,"Otp is expired!! Regenerate the Verification Mail")
    }
    
    const hashedOtp = checkOtp.otpGenerated;
    
    const isCorrectOtp = await bcrypt.compare(otp,hashedOtp);
    
    if(!isCorrectOtp){
        throw new ApiError(400,"OTP provided is wrong!!")
    }

    //user verified
    await Otp.deleteMany({
        email
    })
    return true;
}

export {
    sendOtpVerificationMail,
    verifyOtp
}