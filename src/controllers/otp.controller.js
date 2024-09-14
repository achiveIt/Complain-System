import {Otp} from "../models/otp.model.js";
import mailSender from '../utils/MailSender.js';
import bcrypt from 'bcrypt'
import ApiError from '../utils/ApiError.js'

const sendOtpVerificationMail = async(email) => {

    const checkIfOtpExists = await Otp.findOne({email});

    if(checkIfOtpExists && (Date.now() - checkIfOtpExists.createdAt.getTime()) < 5 * 60 * 1000){
        return 400;
    }
    
    const otpGenerated = `${Math.floor(1000 + Math.random()*9000)}`;

    const hashedOtp =  await bcrypt.hash(otpGenerated, 8);

    const newOtp = await Otp.create({
        email,
        otpGenerated:hashedOtp,
        expiresAt: Date.now() + (5*60000)
    })

    if(!newOtp){
        return 500;
    }

    try {
        const title = "Email Verfication";
        const body = `<h1>Please confirm your Email</h1>
                     <p>Here is your Otp Code: ${otpGenerated}`

        const mailResponse = mailSender(email,title,body);
         
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

const verifyOtp = async(email, otp) => {
    const checkOtp = await Otp.findOne({
        email
    })

    if(!checkOtp){
        throw new ApiError(400,"Email is not yet registered!!");
    }

    const currentTime = Date.now();
    const expiryTime = checkOtp.expiresAt;

    if(expiryTime<currentTime){
        await Otp.deleteMany({
            email
        })
        
        //throw new ApiError(400,"Otp is expired!! Regenerate the Verification Mail")
        return 300;
    }
    console.log("Comparing");
    
    const hashedOtp = checkOtp.otpGenerated;
    console.log(hashedOtp);
    
    const isCorrectOtp = await bcrypt.compare(otp,hashedOtp);
    console.log(isCorrectOtp);
    
    if(!isCorrectOtp){
        //throw new ApiError(400,"OTP provided is wrong!!")
        return 400;
        // return false;
    }

    //user verified
    await Otp.deleteMany({
        email
    })
    // return res
    // .status(200)
    // .json(200, {}, "OTP Verified")
    return 200;
}

export {
    sendOtpVerificationMail,
    verifyOtp,
}