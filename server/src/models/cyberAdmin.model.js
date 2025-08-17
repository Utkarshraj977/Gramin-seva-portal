import mongoose, {Schema} from "mongoose";

const cyberSchema = new Schema(
    {
        cyber_shopPic:{
            type:String,
            required: true,
        },
        Experience:{
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
        iscyber:{
            type:Boolean,
            required: true,
        },
        cyberUser:[
            {
                type: Schema.Types.ObjectId,
                ref: "CyberUser"
            }
        ],
        userInfo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        cyberKey:{
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

export const Cyber = mongoose.model("Cyber", cyberSchema)