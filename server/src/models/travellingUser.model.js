import mongoose, {Schema} from "mongoose";

const travellingUserSchema = new Schema(
    {
      
 
        start:{
            type:String,
            required: true,
        },
        destination:{   
            type:String,
            required: true,
        },

        isTravellingUser:{
            type:Boolean,
            required: true,
        },

        userInfo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        TravellingUserKey:{
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

export const TravellingUser = mongoose.model("TravellingUser", travellingUserSchema)

