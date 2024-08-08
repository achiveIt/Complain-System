import mongoose, {Schema} from "mongoose";

const complaintSchema = new Schema(
    {
        owner:{
            type: Schema.Types.ObjectId,
            ref: "Student"
        },
        hostel:{
            type: String,
            required: [true, "Kindly enter your hostel number"],
            trim: true
        },
        floor:{
            type: String,
            required: [true, "Kindly enter your floor number"],
            trim: true
        },
        location:{
            type: String,
            required: [true, "Kindly enter the location"],
        },
        type:{
            type: String,
            enum: ['Maintainance', 'Housekeeping', 'Plumbing Related', 'Ac or Duct related'],
            required: true
        },
        desc:{
            type: String,
            required: true
        },
        photo:{
            type: String,
            required: true
        },
        status:{
            type: String,
            enum: ['Not Read', 'Read', 'Assigned', 'Resolved'],
            required: true
        },
        reminder:{
            type: Number,
            default: 0,
            required: true
        },
        reminderDates: [
            {
                type: Date
            }
        ],
        preferedDateandTime:{
            type: Date,
            required: true
        }

    },
    {
        timestamps: true
    }
)

export const Complaint = mongoose.model("Compalint", complaintSchema)