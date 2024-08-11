import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Student } from "../models/student.model.js";
import { Warden } from "../models/warden.model.js";

export const verifyJWT = asyncHandler(async(req,res,next)=>{

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"Unauthorized Token")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_SECRET)
    
        const student = await Student.findById(decodedToken._id).select("-password -refreshToken")
    
        const warden = await Warden.findById(decodedToken._id).select("-password -refreshToken")
    
        if(!student && !warden){
            throw new ApiError(500, "Invalid Access Token")
        }
    
        if(student){
            req.user = student;
            next()
        }
        if(warden){
            req.user = warden;
            next()
        }
    } catch (error) {
        throw new ApiError(401, error?.message || "AUTH ERROR")
    }
})