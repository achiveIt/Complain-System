import { Token } from "../models/token.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt"
import mailSender from "../utils/MailSender.js";
import crypto from "crypto";

const requestPasswordReset = async(email) => {
    
    //delete any previous Token if they exist
    await Token.deleteMany({email}); 

    const newToken = crypto.randomBytes(32).toString("hex")

    const hashedToken = await bcrypt.hash(newToken, 8)

    const saveToken = await Token.create({
        email,
        tokenGenerated: hashedToken,
        expiresAt: Date.now() + (5 * 60 * 1000),
        createdAt: Date.now()
    })

    if(!saveToken){
        throw new ApiError(500, "Error while creating Token")
    }

    const link = `${process.env.CLIENT_URL}/passwordReset?Token=${newToken}`

    try {
        const title = "Password Reset Request";
        const body = `<p>Hii,</p>
                    <p>You requested to reset your password.</p>
                    <p> Please, click the link below to reset your password</p>
                    <a href="https://{{link}}">Reset Password</a>`

        const mailResponse = mailSender(email,title,body);
         
        console.log("Email sent successfully: ", mailResponse);

        return link;

    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

const verifyResetPasswordToken = async(token, email) => {
    try {
        const passwordResetToken = await Token.findOne({email})
        
        if(!passwordResetToken){
            throw new ApiError(400, "Invalid or expired password reset Token");
        }
    
        const hashedToken = passwordResetToken.tokenGenerated

        const isValidToken = await bcrypt.compare(token, hashedToken)
    
        if(!isValidToken){
            throw new ApiError(400, "Invalid or expired password reset Token")
        }

        await passwordResetToken.deleteOne()
    
        return true
    } catch (error) {
        throw new ApiError(500,error.message)
    }
}

export {
    requestPasswordReset,
    verifyResetPasswordToken
}