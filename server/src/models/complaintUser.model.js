import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const complaintUserSchema = new Schema(
    {
        isComplaintUser: {
            type: Boolean,
            required: true,
            default: true
        },
        userInfo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        ComplaintUserKey: {
            type: String,
            required: true
        },
        // ✅ NEW: Store connected admins
        myConnections: [{
            admin: {
                type: Schema.Types.ObjectId,
                ref: "ComplaintAdmin"
            },
            status: {
                type: String,
                enum: ["Pending", "Accepted", "Rejected"],
                default: "Pending"
            },
            connectedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    {
        timestamps: true
    }
);

complaintUserSchema.pre("save", async function (next) {
    if (!this.isModified("ComplaintUserKey")) return next();
    this.ComplaintUserKey = await bcrypt.hash(this.ComplaintUserKey, 10);
    next();
});

complaintUserSchema.methods.isKeyCorrect = async function (ComplaintUserKey) {
    return await bcrypt.compare(ComplaintUserKey, this.ComplaintUserKey);
};

export const ComplaintUser = mongoose.model("ComplaintUser", complaintUserSchema);