import { Student } from "../models/student.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import { sendOtpVerificationMail, verifyOtp } from "./otp.controller.js";
import ApiResponse from "../utils/ApiResponse.js";

const checkRollNo =  (rollNo)=>{
    let regex = /^\d{2}[a-z]{3}\d{3}$/;
    return regex.test(rollNo);
}
const checkEmail = (email)=>{
    let regex= /^\d{2}[a-z]{3}\d{3}@lnmiit\.ac\.in$/;
    return regex.test(email);
}
const isSameEmailRollNo = (email,rollNo)=>{
    let ind=0;
    for (let index = 0; index < rollNo.length; index++) {
        if(rollNo[index]!=email[ind]) return false;
        ind++;
    }
    return true;
}

const generateAccessAndRefreshToken = async(studentId) => {
    try {
        const student = await Student.findById(studentId)
        const accessToken = student.generateAccessToken()
        const refreshToken = student.generateRefreshToken()

        student.refreshToken = refreshToken
        await student.save( {validateBeforeSave: false} )

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Error while generating access and refresh token")
    }
}

const registerStudent =  asyncHandler(async(req,res)=>{
    const {name,rollNo,email,phoneNo,password} = req.body;

    if(!name || name.trim() === ""){
        throw new ApiError(400,"Name cannot be empty!!")
    }
    if(!rollNo || rollNo.trim() === ""){
        throw new ApiError(400,"Roll Number cannot be empty!!")
    }
    if(!email || email.trim() === ""){
        throw new ApiError(400,"Email cannot be empty!!")
    }
    if(!phoneNo || phoneNo.trim() === ""){
        throw new ApiError(400,"Phone Number cannot be empty!!")
    }
    if(!checkRollNo(rollNo)){
        throw new ApiError(400,"Roll Number is not in correct form")
    }

    if(!checkEmail(email)){
        throw new ApiError(400,"Email is not in correct form")
    }

    if(phoneNo.length != 10){
        throw new ApiError(400,"Phone Number must be of 10 digits")
    }

    if(!isSameEmailRollNo(email,rollNo)){
        throw new ApiError(400,"Email and Roll Number are not matching")
    }
    if(!password || password.trim() === ""){
        throw new ApiError(400,"Password cannot be empty!!")
    }

    const checkStudentPresntOrNot= await Student.findOne({email})

    if(checkStudentPresntOrNot){
        throw new ApiError(400,"Student is already registered! Kindly Sign In")
    }

    const newStudent = new Student({
        name,
        rollNo,
        email,
        phoneNo,
        password,
    })

    await newStudent.save();
    
    //Nodemailer OTP verification 
    await sendOtpVerificationMail(email);

    return res.status(200).json(
        new ApiResponse(200,{},"Email Verification Mail Sent!!")
    )
})

const verifyStudentOtp = asyncHandler(async(req,res)=>{
    const {email,otp} = req.body;
    
    const response = await verifyOtp(email,otp);
    
    if(response){
        try {
            const newStudent = await Student.findOne({email})
        
            if(!newStudent){
                throw new ApiError(500,"Error while fetching student")
            }
        
            newStudent.isVerified = true;
        
            await newStudent.save( {validateBeforeSave: false} );

            return res.status(200).json( 
                new ApiResponse(200,newStudent,"Student registered Successfully!!")
            )
        } catch (error) {
            return res.status(500).json( 
                new ApiResponse(500,{},"Error while Email Verification")
            )    
        }
    }
    else{
        return res.status(200,{},"Wrong OTP")
    }
})

const loginStudent = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    if(!email){
        throw new ApiError(400,"Email Field is Required")
    }

    if(!password){
        throw new ApiError(400,"Password is Required")
    }

    const student = await Student.findOne({email});

    if(!student){
        throw new ApiError(404,"Kindly register first!!")
    }

    const isPasswordValid = await student.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Incorrect Password")
    }

    const {accessToken , refreshToken} = await 
    generateAccessAndRefreshToken(student._id);

    const updatedStudent = await Student.findById(student._id).select("-password -refreshToken" ) //doubt

    const options={
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,{updatedStudent,accessToken,refreshToken},"Logged in successfully!!")
    )
})


export {
    registerStudent,
    verifyStudentOtp,
    loginStudent
}