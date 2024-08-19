import asyncHandler from "../utils/asyncHandler.js";
import { Complaint } from "../models/complaint.model.js";
import { Comment } from "../models/comment.model.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";

const addComment = asyncHandler(async (req, res) => {
    const {complaintId} = req.params
    const {content} = req.body

    if(!isValidObjectId(complaintId)){
        throw new ApiError(400, "Invalid Complaint Id")
    }

    if(!content?.trim()){
        throw new ApiError(400, "Content is required!!")
    }

    const comment = await Comment.create(
        {
            owner: req.user?._id,
            complaint_id: complaintId,
            content
        }
    )

    if(!comment){
        throw new ApiError(400, "Error while adding comment")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {comment}, "Comment added successfully"))
})

const updateComment = asyncHandler(async(req, res) => {
    const {commentId} = req.params
    const {content} = req.body

    if(!isValidObjectId(complaintId)){
        throw new ApiError(400, "Invalid Complaint Id")
    }

    if(!content?.trim()){
        throw new ApiError(400, "Content is required!!")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    if(!updatedComment){
        throw new ApiError(400, "Error while updating comment!!")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, {updatedComment}, "Comment updated successfully"))
})

export{
    addComment,
    updateComment
}