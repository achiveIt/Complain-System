import { Warden } from '../models/warden.model.js'
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js'
import { sendOtpVerificationMail, verifyOtp } from './otp.controller.js';
import {checkPassword, checkEmail, isDigitsOnly, checkIfStudentEmail} from "../utils/checkFunctions.js"
import { requestPasswordReset, verifyResetPasswordToken } from './token.controller.js';

const generateAccessAndRefreshToken = async (wardenId) => {
    try {
        const warden = await Warden.findById(wardenId)
        const accessToken = Warden.generateAccessToken()
        const refreshToken = Warden.generateRefreshToken()

        warden.refreshToken = refreshToken
        await warden.save( {validateBeforeSave: false} )

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Error while generating access and refresh token")
    }
}

const registerWarden = asyncHandler(async (req, res) => {
    const {name,position,phoneNo,email,hostel,password}= req.body;

    if(
        [name, position, phoneNo, email, hostel].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    if(phoneNo.length != 10){
        throw new ApiError(400, "Phone Number must be 10 digits long")
    }

    if(!isDigitsOnly(phoneNo)){
        throw new ApiError(400,"Phone Number should contain digits only!!")
    }

    // if(checkIfStudentEmail(email)){
    //     throw new ApiError(400, "Students are not allowed to register for wardens account")  //useful?
    // }

    if(!checkEmail(email)){
        throw new ApiError(400, "Kindly provide college email")
    }

    if(!password || password.trim() === ""){
        throw new ApiError(400,"Password field cannot be empty")
    }

    checkPassword(password);
    
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

    const response = await sendOtpVerificationMail(email);

    if(response == 400){
        throw new ApiError(400, "Otp can be requested only after 5 mins")
    }else if(response == 500){
        throw new ApiError(500, "Error while Saving OTP")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Email Verification Mail Sent!!"))
})

const verifyWardenOtp = asyncHandler(async (req, res) => {
    const {email , otp} = req.body

    if(!email || email.trim() === " "){
        throw new ApiError(400, "Email is not provided")
    }

    if(!checkEmail(email)){
        throw new ApiError(400, "Kindly provide college email")
    }

    if(!otp || otp.trim() === ""){
        throw new ApiError(400, "OTP is not provided")
    }
   
    const response = await verifyOtp(email, otp);

    if(response == 200){
        try {
            const newWarden = await Warden.findOne({email})
        
            if(!newWarden){
                throw new ApiError(500,"Error while fetching Warden")
            }
        
            newWarden.isVerified = true;
        
            await newWarden.save( {validateBeforeSave: false} );

            return res
            .status(200)
            .json(new ApiResponse(200,newWarden,"Warden registered Successfully!!"))

        } catch (error) {
            return res
            .status(500)
            .json(new ApiResponse(500,{},"Error while Email Verification"))    
        }
    }
    else if(response == 400){
        return res
        .status(200)
        .json( new ApiResponse(400, {}, "Wrong OTP"))
    }
    else{
        return res
        .status(200)
        .json(new ApiResponse(400, {}, "OTP is Expired"))
    }
})

const regenerateOtp = asyncHandler(async (req, res) => {
    const {email} = req.body 
    
    if(!email || email.trim() === ""){
        throw new ApiError(400, "Email field cannot be empty")
    }

    if(!checkEmail(email)){
        throw new ApiError (400, "Enter college email Id")
    }

    const response = await sendOtpVerificationMail(email);

    if(response == 400){
        throw new ApiError(400, "Otp can be requested only after 5 mins")
    }else if(response == 500){
        throw new ApiError(500, "Error while Saving OTP")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Email Verification Mail Sent!!"))
})

const loginWarden = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if(!email || email.trim() === " "){
        throw new ApiError(400, "Email is required");
    }

    if(checkIfStudentEmail(email)){
        throw new ApiError(400,"Kindly Login through Student SignIn")
    }

    if(!checkEmail(email)){
        throw new ApiError(400, "Kindly provide college email")
    }

    if(!password){
        throw new ApiError(400, "Password is required")
    }

    const warden = await Warden.findOne({email})

    if(!warden){
        throw new ApiError(404, "User not registerd, Kindly register first")
    }

    if(!warden.isVerified){
        throw new ApiError(400, "Kindly verify your mail first")
    }

    const isPasswordValid = await warden.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(400, "Incorrect Password")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(warden._id);

    const updateWarden = await Warden.findById(warden._id).select("-password -refreshToken" ) //doubt

    const options={
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,{updateWarden,accessToken,refreshToken},"Logged in successfully!!")
    )
})

const logOutWarden = asyncHandler(async (req, res) => {
    const wardenId = req.user?._id

    await Warden.findByIdAndUpdate(
        wardenId,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{},"User Logged Out"))
})

const changePassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const wardenId = req.user?._id

    if(!oldPassword || oldPassword.trim() === ""){
        throw new ApiError(400, "Old Password is required!! Or try forget password")
    }

    const warden = await Warden.findById(wardenId)

    const isPasswordValid = warden.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(400,"Old Password is wrong!!")
    }

    if(!newPassword || newPassword.trim() === ""){
        throw new ApiError(400, "New Password is required")
    }

    checkPassword(newPassword)

    if(oldPassword == newPassword){
        throw new ApiError(400, "Old and New password are both same")
    }
    
    warden.password = newPassword
    await warden.save( {validateBeforeSave: false} )

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password Updated Successfully!!"))
})

const updatePhoneNo = asyncHandler(async (req, res) => {
    const {phoneNo} = req.body;
    const wardenId = req.user?._id;

    if(!phoneNo || phoneNo.trim() === ""){
        throw new ApiError(400, "Kindly enter phone number")
    }

    if(!isDigitsOnly(phoneNo)){
        throw new ApiError(400,"Phone Number should contain digits only!!")
    }

    if(phoneNo.length != 10){
        throw new ApiError(400,"Phone Number should contain 10 digits only!!")
    }

    const warden = await Warden.findById(wardenId)

    if(!warden){
        throw new ApiError(500, "Error while fetching User info")
    }

    warden.phoneNo = phoneNo
    await warden.save( {validateBeforeSave: false} )

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Phone Number Updated Successfully"))
})

const passwordResetRequest = asyncHandler(async (req, res) => {
    const {email} = req.body

    const link = await requestPasswordReset(email)

    if(!link){
        throw new ApiError(500, "Error while generating link")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,link,"Password Reset Link Successfully Send"))
})

const passwordReset = asyncHandler(async (req, res) => {
    const {token} = req.query
    const wardenId = req.user?._id
    
    const warden = await Warden.findById(wardenId)

    if(!warden){
        throw new ApiError(404,"User not Found")
    }

    const {password, confirmPassword} = req.body

    if(!password || password.trim() === ""){
        throw new ApiError(400, "Password is empty")
    }

    if(!confirmPassword || confirmPassword.trim() === ""){
        throw new ApiError(400, "Confirm Password is empty")
    }

    if(password != confirmPassword){
        throw new ApiError(400, "Password and confirm password are not matching")
    }

    checkPassword(confirmPassword);
    
    const response = await verifyResetPasswordToken(token,warden.email)

    if(response){
        try {
            warden.password = password
            await warden.save( {validateBeforeSave: false} )
    
            return res
            .status(200)
            .json(new ApiResponse(200,{},"Password Updated Successfully"))
        } catch (error) {
            throw new ApiError(500, error.message)
        }
    }
    else{
        throw new ApiError(500, "Password reset failed")
    }
})

export{
    registerWarden,
    verifyWardenOtp,
    regenerateOtp,
    loginWarden,
    logOutWarden,
    changePassword,
    updatePhoneNo,
    passwordResetRequest,
    passwordReset
}