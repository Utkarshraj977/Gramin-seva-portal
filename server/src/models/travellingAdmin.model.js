import mongoose, {Schema} from "mongoose";

const travellingAdminSchema = new Schema(
    {
        CarPhoto:{
            type:String,
            required: true,
        },
        Driver_License:{
            type:String,
            required: false,
        },
        carNumber:{
            type:String,
            required: true,
        },
        category:{   
            type:String,
            required: true,
        },

        isTravellingAdmin:{
            type:Boolean,
            required: true,
        },
        AllTraveller:[
            {
                type: Schema.Types.ObjectId,
                ref: "TravellingUser"
            }
        ],
        userInfo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        TravellingAdminKey:{
            type:String,
            required:true
        },
         location:{
            type:String,
            required:false
        },
        Type:{  //reserve or passenger
            type:String,
            required:true
        }

    },{
        timestamps:true
    }
)

export const TravellingAdmin = mongoose.model("TravellingAdmin", travellingAdminSchema)
