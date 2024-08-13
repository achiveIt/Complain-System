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


const addComplaintReminder = asyncHandler(async (req, res) => {
    const {complaintId} = req.params

    if(!isValidObjectId(complaintId)){
        throw new ApiError(400, "Invalid Compalint Id")
    }

    const complaint = await Complaint.findById(complaintId);
    if(complaint.status === "Resolved"){
        throw new ApiError(400, "Complaint already being resolved !!")
    }
    else if(complaint.type === "Housekeeping" ){
        if(complaint.reminderDates.length === 0){
            const compalintTime = complaint.createdAt.getTime()
            const currentTime = new Date().getTime()
            if (currentTime - compalintTime >= (60*60*1000)) {
                complaint.reminder = (complaint.reminder + 1);
                complaint.reminderDates.push( Date.now())
                await complaint.save({validateBeforeSave: false})
                return res
                .status(200)
                .json(new ApiResponse(200, {complaint}, "Reminder added successfully"))
            }else {
                throw new ApiError(400, "Reminder for the HouseKeeping complaints can be added only after 1 hour from the time of compalint")
            }
        }
        else{
            const lastComplaintTime = complaint.reminderDates.at(-1).getTime()
            const currentTime = new Date().getTime()

            if(currentTime - lastComplaintTime >= (60*60*1000)){
                complaint.reminder = (complaint.reminder + 1);
                complaint.reminderDates.push( Date.now())
                await complaint.save({validateBeforeSave: false})
                return res
                .status(200)
                .json(new ApiResponse(200, {complaint}, "Reminder added successfully"))
            }else{
                throw new ApiError(400, "Reminder for the HouseKeeping complaints can be added only after 1 hour from the previous reminder")
            }
            
        }
    }
    else{
        if(complaint.reminderDates.length === 0){
            const compalintTime = complaint.createdAt.getTime()
            const currentTime = new Date().getTime()
            if (currentTime - compalintTime >= (24*60*60*1000)) {
                complaint.reminder = (complaint.reminder + 1);
                complaint.reminderDates.push( Date.now())
                await complaint.save({validateBeforeSave: false})
                return res
                .status(200)
                .json(new ApiResponse(200, {complaint}, "Reminder added successfully"))
            } else {
                throw new ApiError(400, "Reminder for the complaint can be added only after 24 hours from the time of compalint")
            }
        }
        else{
            const lastComplaintTime = complaint.reminderDates.at(-1).getTime()
            const currentTime = new Date().getTime()

            if(currentTime - lastComplaintTime >= (24*60*60*1000)){
                complaint.reminder = (complaint.reminder + 1);
                complaint.reminderDates.push( Date.now())
                await complaint.save({validateBeforeSave: false})
                return res
                .status(200)
                .json(new ApiResponse(200, {complaint}, "Reminder added successfully"))
            }else{
                throw new ApiError(400, "Reminder for the HouseKeeping complaint can be added only after 24 hours from the previous reminder")
            }
            
        }
    }
    
})

export {
    createComplaint, 
    changeComplaintStatus,
    addComplaintReminder
}