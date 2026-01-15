import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const complaintAdminSchema = new Schema(
    {
        // --- Identity ---
        iscomplaintAdmin: {
            type: Boolean,
            required: true,
            default: true
        },
        userInfo: {
            // User model se link, naam/email ke liye
            type: Schema.Types.ObjectId, 
            ref: "User",
            required: true
        },
        ComplaintAdminKey: { // Admin Login PIN/Password
            type: String,
            required: true
        },

        // --- Official Role Details ---
        designation: { 
            type: String, 
            default: "Gram Pradhan" // e.g., Sachiv, Ward Member
        },
        assignedWard: { 
            type: String, // e.g., "Ward No. 5"
            default: "All"
        },
        department: {
            type: String, // e.g., "Public Works", "Sanitation"
            default: "General"
        },

        // --- Office Info ---
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

        // --- Documents ---
        complaintAdmin_certificate: {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        },

        // --- Connection Requests (From Users) ---
        // Isko humne Schema ke andar move kar diya hai
        connectionRequests: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User" // Connection request bhejne wale user ki ID
                },
                status: {
                    type: String,
                    enum: ["Pending", "Accepted", "Rejected"],
                    default: "Pending"
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true // Ye ab sahi jagah par hai (Schema ke second argument mein)
    }
);

// --- Secure Password Hashing ---
complaintAdminSchema.pre("save", async function (next) {
    if (!this.isModified("ComplaintAdminKey")) return next();
    this.ComplaintAdminKey = await bcrypt.hash(this.ComplaintAdminKey, 10);
    next();
});

// --- Password Verification Method ---
complaintAdminSchema.methods.isKeyCorrect = async function (ComplaintAdminKey) {
    return await bcrypt.compare(ComplaintAdminKey, this.ComplaintAdminKey);
};

export const ComplaintAdmin = mongoose.model("ComplaintAdmin", complaintAdminSchema);