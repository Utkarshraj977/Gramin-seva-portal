import mongoose, {Schema} from "mongoose";


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
        },
         location:{
            type:String,
            required:false
        }
    },{
        timestamps:true
    }
)

export const ComplaintUser = mongoose.model("ComplaintUser", complaintUserSchema)
