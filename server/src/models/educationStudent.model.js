import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
    {
        clas: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        board: {   
            type: String,
            required: true,
        },
        isStudent: {
            type: Boolean,
            required: true,
            default: true
        },
        // User ki details store karne ke liye (Fullname, Avatar, ID etc.)
        userInfo: {
            type: Schema.Types.Mixed,
            required: true
        },
        StudentKey: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: false
        },
        
        // ✅ IMPORTANT: Status Tracking ke liye ye fields zaroori hain
        message: { 
            type: String, 
            default: "Pending" 
        },
        status: { 
            type: String, 
            enum: ["Pending", "selected", "rejected"], // Sirf ye 3 values allow hongi
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
)

export const Student = mongoose.model("Student", studentSchema);