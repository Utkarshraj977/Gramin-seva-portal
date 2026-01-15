import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const travellingUserSchema = new Schema(
    {
        userInfo: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        TravellingUserKey: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: false // Changed to optional based on your code
        },
        // Stores the ID of the Driver/Admin the user is currently riding with
        AllRide: {
            type: Schema.Types.ObjectId, 
            ref: "TravellingAdmin",
            default: null
        }
    },
    {
        timestamps: true
    }
);

travellingUserSchema.pre("save", async function (next) {
    if (!this.isModified("TravellingUserKey")) return next();
    this.TravellingUserKey = await bcrypt.hash(this.TravellingUserKey, 10);
    next();
});

travellingUserSchema.methods.isTravellingkeyvalid = async function (TravellingUserKey) {
    return await bcrypt.compare(TravellingUserKey, this.TravellingUserKey);
};

export const TravellingUser = mongoose.model("TravellingUser", travellingUserSchema);