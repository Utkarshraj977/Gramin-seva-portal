import mongoose, {Schema} from "mongoose";

const cyberUserSchema = new Schema(
    {

        message:{
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
        iscyberUser:{
            type:Boolean,
            required: true,
        },
 
        userInfo:{
            type: Schema.Types.Mixed,
            ref: "User"
        },
        cyberUserKey:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:false
        }

    },
    {
        timestamps: true
    }
)

export const CyberUser = mongoose.model("CyberUser", cyberUserSchema)