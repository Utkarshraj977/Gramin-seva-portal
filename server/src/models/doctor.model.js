import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const doctorSchema = new Schema(
    {
        Doctor_certificate: {
            type: String,
            required: true,
        },
        Experience: {
            type: String,
            required: true,
        },
        Type: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        Start_time: {
            type: String,
            required: false,
        },
        End_time: {
            type: String,
            required: false,
        },
        isDoctor: {
            type: Boolean,
            required: true,
        },
        patient: [
            {
                type: Schema.Types.ObjectId,
                ref: "Patient"
            }
        ],
        // ✅ NEW: Array to store pending patient requests
        pendingPatientRequests: [
            {
                type: Schema.Types.ObjectId,
                ref: "Patient"
            }
        ],
        userInfo: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        DoctorKey: {
            type: String,
            required: true,
            match: [/^\d{6}$/, "DoctorKey must be exactly 6 digits"],
        },
        location: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

doctorSchema.pre("save", async function (next) {
    if (!this.isModified("DoctorKey")) return next();

    this.DoctorKey = await bcrypt.hash(this.DoctorKey, 10)
    next();
})

doctorSchema.methods.isDoctorKeyCorrect = async function (DoctorKey) {
    return await bcrypt.compare(DoctorKey, this.DoctorKey)
}

export const Doctor = mongoose.model("Doctor", doctorSchema)