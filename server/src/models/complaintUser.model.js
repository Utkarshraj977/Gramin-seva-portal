import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const complaintUserSchema = new Schema(
    {
        // --- Identity ---
        isComplaintUser: {
            type: Boolean,
            required: true,
            default: true
        },
        userInfo: {
            type: Schema.Types.ObjectId,
            ref: "User", // Main User model se connect rahega
            required: true
        },
        ComplaintUserKey: { // Secret PIN for login
            type: String,
            required: true
        },

        // --- Complaint Details (Dashboard Data) ---
        title: { 
            type: String,
            required: true, 
            trim: true,
            index: true // Search karne ke liye fast hoga
        },
        category: { 
            type: String,
            required: true,
            // Ye categories dashboard pe filter karne me kaam ayengi
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
        
        // --- Evidence (Photo Upload) ---
        complaintImage: {
            url: { type: String },       // Cloudinary URL
            public_id: { type: String }  // Cloudinary ID
        },

        // --- Status & Resolution (Admin Control) ---
        status: {
            type: String,
            // Ye status dashboard par color change karega
            enum: ["Pending", "In Progress", "Resolved", "Rejected"],
            default: "Pending"
        },
        adminResponse: { // Pradhan ji ka jawab yahan store hoga
            type: String,
            default: ""
        },
        resolvedAt: { // Kis din solve hua
            type: Date
        },

        // 👇 NEW FIELD (Ab ye sahi jagah par hai - object ke andar)
        myConnections: [
            {
                admin: {
                    type: Schema.Types.ObjectId,
                    ref: "ComplaintAdmin"
                },
                status: {
                    type: String,
                    enum: ["Pending", "Accepted", "Rejected"],
                    default: "Pending"
                }
            }
        ]
    }, 
    // 👇 Schema Options (Second Argument)
    {
        timestamps: true
    }
);

// --- Password Hashing Middleware ---
complaintUserSchema.pre("save", async function (next) {
    if (!this.isModified("ComplaintUserKey")) return next();
    this.ComplaintUserKey = await bcrypt.hash(this.ComplaintUserKey, 10);
    next();
});

// --- Password Verification Method ---
complaintUserSchema.methods.isKeyCorrect = async function (ComplaintUserKey) {
    return await bcrypt.compare(ComplaintUserKey, this.ComplaintUserKey);
};

export const ComplaintUser = mongoose.model("ComplaintUser", complaintUserSchema);