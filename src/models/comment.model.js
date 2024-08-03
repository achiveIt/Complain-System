import mongoose,{Schema} from "mongoose";

const commentSchema = new Schema(
    {
        owner:{
            type: Schema.Types.ObjectId,
            ref: "Student"
        }
    }
)

export const Comment = mongoose.model("Comment", commentSchema)