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
        return 500;
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
        return 503;
    }
}

const verifyResetPasswordToken = async(token, email) => {
    try {
        const passwordResetToken = await Token.findOne({email})
        
        if(!passwordResetToken){
            return 400;
        }
    
        const hashedToken = passwordResetToken.tokenGenerated

        const isValidToken = await bcrypt.compare(token, hashedToken)
    
        if(!isValidToken){
            return 400;
        }

        await passwordResetToken.deleteOne()
    
        return 200;
    } catch (error) {
        return 500;
    }
}

export {
    requestPasswordReset,
    verifyResetPasswordToken
}