import mongoose,{Schema} from "mongoose";

const commentSchema = new Schema(
    {
        owner:{
            type: Schema.Types.ObjectId,
            ref: "Warden"
        },
        complaint_id:{
            type: Schema.Types.ObjectId,
            ref: "Complaint"
        },
        content:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Comment = mongoose.model("Comment", commentSchema)