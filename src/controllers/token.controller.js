import { token } from "../models/token.model.js";
import ApiError from "../utils/ApiError.js";

const requestPasswordReset = async(email) => {
    
    //delete any previous token if they exist
    await anyPrevToken.deleteMany({email}); 

    const newToken = crypto.randomBytes(32).toString("hex")

    const hashedToken = await bcrypt.hash(newToken, 8)

    const saveToken = await token.create({
        email,
        tokenGenerated: hashedToken,
        expiresAt: Date.now() + (5 * 60 * 1000)
    })

    if(!saveToken){
        throw new ApiError(500, "Error while creating token")
    }

    const link = `${process.env.CLIENT_URL}/passwordReset?token=${newToken}&id=${user._id}`

    try {
        const title = "Password Reset Request";
        const body = `<p>Hii,</p>
                    <p>You requested to reset your password.</p>
                    <p> Please, click the link below to reset your password</p>
                    <a href="${link}">Reset Password</a>`

        const mailResponse = mailSender(email,title,body);
         
        console.log("Email sent successfully: ", mailResponse);

        return link;

    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

const resetPassword = async(token) => {
    const passwordResetToken = await token.findOne({token});

    if(!passwordResetToken){
        throw new ApiError(400, "Invalid or expired password reset token");
    }

    const isValidToken = await bcrypt.compare(token, passwordResetToken.tokenGenerated)

    if(!isValidToken){
        throw new ApiError(400, "Invalid or expired password reset token")
    }

    const email = passwordResetToken.email

    await passwordResetToken.deleteOne()

    return email
}

export {
    requestPasswordReset,
    resetPassword
}