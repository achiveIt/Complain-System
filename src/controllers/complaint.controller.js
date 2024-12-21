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
        //throw new ApiError(400, "All fields are required")
        return res
                .status(400)
                .json(
                    new ApiResponse(400, " ", "ALL fields are compulsory")
                )
    }

    if(!isValidObjectId(student)){
        return res
                .status(401)
                .json(
                    new ApiResponse(401, " ", "Invalid student id")
                )
    }

    const photoLocalPath = req.files?.photo[0]?.path

    if(!photoLocalPath){
        return res
                .status(400)
                .json(
                    new ApiResponse(400, " ", "ALL fields are compulsory")
                )
    }

    const photo = await uploadOnCloudinary(photoLocalPath)

    if(!photo){
        return res
                .status(501)
                .json(
                    new ApiResponse(501, " ", "Error while uploading photos")
                )
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

    const addedComplaint = await Complaint.findById(complaint._id);

    if(!addedComplaint){
        return res
                .status(500)
                .json(
                    new ApiResponse(500, " ", "Error while adding complaint")
                )
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
        return res
                .status(401)
                .json(
                    new ApiResponse(401, " ", "Invalid student id")
                )
    }

    if(!isValidObjectId(complaintId)){
        return res
                .status(401)
                .json(
                    new ApiResponse(401, " ", "Invalid complaint id")
                )
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
        return res
                .status(401)
                .json(
                    new ApiResponse(401, " ", "Invalid complaint id")
                )
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