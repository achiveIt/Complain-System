import asyncHandler from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";


const createComplaint = asyncHandler(async (req, res) => {
    const {student} = req.student?._id
    const {hostel, floor, location, type, desc, photo} = req.body
    
    if(
        [hostel, floor, location, type, desc].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    if(!isValidObjectId(student)){
        throw new ApiError(400, "Invalid user id")
    }


})

export {createComplaint}