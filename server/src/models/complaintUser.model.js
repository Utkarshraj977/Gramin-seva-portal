import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";

const complaintUserSchema = new Schema(
    {
        isComplaintUser:{
            type:Boolean,
            required: true,
        },
        message:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        userInfo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        ComplaintUserKey:{
            type:String,
            required:true
        }
    },{
        timestamps:true
    }
)

complaintUserSchema.pre("save", async function (next) {
    if(!this.isModified("ComplaintUserKey")) return next();

    this.ComplaintUserKey= await bcrypt.hash(this.ComplaintUserKey, 10)
    next();
})

complaintUserSchema.methods.isKeyCorrect = async function(ComplaintUserKey){
    return await bcrypt.compare(ComplaintUserKey, this.ComplaintUserKey)
}

export const ComplaintUser = mongoose.model("ComplaintUser", complaintUserSchema)
