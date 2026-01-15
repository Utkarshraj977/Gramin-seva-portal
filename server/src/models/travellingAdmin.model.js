import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
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
        category:{   //bolero ,scorpio,bus etc
            type:String,
            required: true,
        },
        isTravellingAdmin:{
            type:Boolean,
            required: true,
        },
        AllTraveller:[
            {
                type: Schema.Types.Mixed,
                ref: "TravellingUser"
            }
        ],
        userInfo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        TravellingAdminKey:{
            type:String,
            required:true,
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

travellingAdminSchema.pre("save",async function(next){
    if (!this.isModified("TravellingAdminKey")) return next();

    this.TravellingAdminKey=await bcrypt.hash(this.TravellingAdminKey,10)
    next();
})

travellingAdminSchema.methods.isTravellerKeyCorrect=async function(TravellingAdminKey){
    return await bcrypt.compare(TravellingAdminKey,this.TravellingAdminKey)
}

export const TravellingAdmin = mongoose.model("TravellingAdmin", travellingAdminSchema)
