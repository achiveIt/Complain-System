import { Student } from "../models/student.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"


const checkRollNo =  (rollNo)=>{
    let regex = /^\d{2}[a-z]{3}\d{3}$/;
    return regex.test(rollNo);
}
const checkEmail = (email)=>{
    let regex= /^\d{2}[a-z]{3}\d{3}@lnmiit\.ac\.in$/;
    return regex.test(email);
}
const isSame = (email,rollNo)=>{
    let ind=0;
    for (let index = 0; index < rollNo.length; index++) {
        if(rollNo[index]!=email[ind]) return false;
        ind++;
    }
    return true;
}

const registerStudent =  asyncHandler(async(req,res)=>{
    const {name,rollNo,email,phoneNo,password} = req.body;

    if(!name || name.trim()===""){
        throw new ApiError(400,"Name cannot be empty!!")
    }
    if(!rollNo || rollNo.trim()===""){
        throw new ApiError(400,"Roll Number cannot be empty!!")
    }
    if(!email || email.trim()===""){
        throw new ApiError(400,"Email cannot be empty!!")
    }
    if(!phoneNo || phoneNo.trim()===""){
        throw new ApiError(400,"Phone Number cannot be empty!!")
    }
    if(!password || password.trim()===""){
        throw new ApiError(400,"Password cannot be empty!!")
    }

    if(!checkRollNo(rollNo)){
        throw new ApiError(400,"Roll Number is not in correct form")
    }

    if(!checkEmail(email)){
        throw new ApiError(400,"Email is not in correct form")
    }

    if(isSame(email,rollNo)){
        throw new ApiError(400,"Email and RollNumber are not matching")
    }

    const checkStudentPresntOrNot= await Student.findOne({
        email
    })

    if(checkStudentPresntOrNot){
        throw new ApiError(400,"Student is already registered! Kindly Sign In")
    }

    
    //Nodemailer OTP verification 
})


export {
    registerStudent
}