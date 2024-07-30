import { Student } from "../models/student.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"


const checkRollNo =  (rollNo)=>{
    let regex = /^\d{2}[a-z]{3}\d{3}$/;
    return regex.test(rollNo);
}

const registerStudent =  asyncHandler(async(req,res)=>{
    const {name,rollNo,email,phoneNo} = req.body;

    if(!name || name.trim()===""){
        throw new ApiError(400,"Name Field is empty!!")
    }
    if(!rollNo || rollNo.trim()===""){
        throw new ApiError(400,"Roll Number Field is empty!!")
    }
    if(!email || email.trim()===""){
        throw new ApiError(400,"Email Field is empty!!")
    }
    if(!phoneNo || phoneNo.trim()===""){
        throw new ApiError(400,"Phone Number Field is empty!!")
    }

    if(!checkRollNo(rollNo)){
        throw new ApiError(400,"Roll Number is not in correct form")
    }

    
})


export {
    registerStudent
}