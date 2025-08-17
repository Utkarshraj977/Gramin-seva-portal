import mongoose, {Schema} from "mongoose";


const complaintAdminSchema = new Schema(
    {
        complaintAdmin_certificate:{
            type:String,
            required: true,
        },
        category:{   //kon sa vibhag ka hai
            type:String,
            required: true,
        },
        Start_time:{
            type:String,
            required: false,
        },
        End_time:{
            type:String,
            required: false,
        },
        iscomplaintAdmin:{
            type:Boolean,
            required: true,
        },
        Allcomplainer:[
            {
                type: Schema.Types.ObjectId,
                ref: "ComplaintUser"
            }
        ],
        userInfo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        ComplaintAdminKey:{
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

export const ComplaintAdmin = mongoose.model("ComplaintAdmin", complaintAdminSchema)
