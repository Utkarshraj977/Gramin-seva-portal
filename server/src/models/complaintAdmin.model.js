import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const complaintAdminSchema = new Schema(
    {
        iscomplaintAdmin: {
            type: Boolean,
            required: true,
            default: true
        },
        userInfo: {
            type: Schema.Types.ObjectId, 
            ref: "User",
            required: true
        },
        ComplaintAdminKey: {
            type: String,
            required: true
        },
        designation: { 
            type: String, 
            default: "Gram Pradhan"
        },
        assignedWard: { 
            type: String,
            default: "All"
        },
        department: {
            type: String,
            default: "General"
        },
        location: { 
            type: String,
            required: true
        },
        Start_time: {
            type: String,
            required: true
        },
        End_time: {
            type: String,
            required: true
        },
        complaintAdmin_certificate: {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        },
        // ✅ NEW: Connection Requests Array
        connectionRequests: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            status: {
                type: String,
                enum: ["Pending", "Accepted", "Rejected"],
                default: "Pending"
            },
            requestedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    {
        timestamps: true
    }
);

complaintAdminSchema.pre("save", async function (next) {
    if (!this.isModified("ComplaintAdminKey")) return next();
    this.ComplaintAdminKey = await bcrypt.hash(this.ComplaintAdminKey, 10);
    next();
});

complaintAdminSchema.methods.isKeyCorrect = async function (ComplaintAdminKey) {
    return await bcrypt.compare(ComplaintAdminKey, this.ComplaintAdminKey);
};

export const ComplaintAdmin = mongoose.model("ComplaintAdmin", complaintAdminSchema);