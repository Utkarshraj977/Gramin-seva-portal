import mongoose, { Schema } from "mongoose";

const complaintSchema = new Schema(
    {
        userInfo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        adminInfo: {
            type: Schema.Types.ObjectId,
            ref: "ComplaintAdmin",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: ["Electricity", "Water", "Roads", "Sanitation", "Health", "Education", "Other"],
            default: "Other"
        },
        message: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        complaintImage: {
            url: { type: String, default: "" },
            public_id: { type: String, default: "" }
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved", "Rejected"],
            default: "Pending"
        },
        adminResponse: {
            type: String,
            default: ""
        },
        resolvedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);