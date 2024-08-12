import asyncHandler from "../utils/asyncHandler.js";
import { Complaint } from "../models/complaint.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createComplaint = asyncHandler(async (req, res) => {
    const {student} = req.student?._id
    const {hostel, floor, location, type, desc, preferedDateandTime} = req.body
    
    if(
        [hostel, floor, location, type, desc, preferedDateandTime].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    if(!isValidObjectId(student)){
        throw new ApiError(400, "Invalid user id")
    }

    const photoLocalPath = req.files?.photo[0]?.path

    if(!photoLocalPath){
        throw new ApiError(400, "photo is required")
    }

    const photo = await uploadOnCloudinary(photoLocalPath)

    if(!photo){
        throw new ApiError(400, "Error while uploading photo")
    }

    const complaint = await Complaint.create(
        {
            owner: req.student._id,
            hostel,
            floor,
            location,
            type,
            desc,
            photo: photo.url,
            preferedDateandTime
        }
    )

    const addedComplaint = await Complaint.findById(video._id);

    if(!addedComplaint){
        throw new ApiError(500, "Error while adding complaint please try again...")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201, complaint, "Complaint added successfully")
    )
})


const changeComplaintStatus = asyncHandler(async (req, res) => {
    const {userId} = req.user?._id
    const {complaintId} = req.params
    const {status} = req.body

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    if(!isValidObjectId(complaintId)){
        throw new ApiError(400, "Invalid comaplint id")
    }

    const complaint = await Complaint.findByIdAndUpdate(
        complaintId,
        {
            status: status
        },
        {
            new: true
        }
    )
    
    return res
    .status(200)
    .json(new ApiResponse(200, {},"Status updated successfully"))
})

export {createComplaint, changeComplaintStatus}