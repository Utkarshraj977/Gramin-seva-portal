import mongoose, {Schema} from "mongoose";

const cyberSchema = new Schema(
    {

        cyber_shopPic: {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
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
        cyberUsers: [
        {
            type: Schema.Types.Mixed,
            ref: "User"  
        }
        ],

        userInfo:{
            type: Schema.Types.Mixed,
            ref: "User"
        },
        cyberKey:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        }
    },

    {
        timestamps: true 
    }
)

export const Cyber = mongoose.model("Cyber", cyberSchema)