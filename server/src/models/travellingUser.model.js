import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
const travellingUserSchema = new Schema(
    {
        from:{
            type:String,
            required: true,
        },
        To:{   
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
        },
        message:{
             type:String,
             required:false
        }
    },{
        timestamps:true
    }
)


travellingUserSchema.pre("save",async function(next){
    if(!this.isModified("TravellingUserKey")) return next();

    this.TravellingUserKey=await bcrypt.hash(this.TravellingUserKey,10)
    next();
})

travellingUserSchema.methods.isTravellingkeyvalid=async function(TravellingUserKey){
    return await bcrypt.compare(TravellingUserKey,this.TravellingUserKey)
}

export const TravellingUser = mongoose.model("TravellingUser", travellingUserSchema)

