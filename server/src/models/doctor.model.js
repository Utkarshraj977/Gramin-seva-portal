import mongoose, {Schema} from "mongoose";


const doctorSchema = new Schema(
    {
        Doctor_certificate:{
            type:String,
            required: true,
        },
        Experience:{
            type:String,
            required: true,
        },
        Type:{     //human or animal or both
            type:String,
            required: true,
        },
        category:{   //gen physician or any
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
        isDoctor:{
            type:Boolean,
            required: true,
        },
        patient:[
            {
                type: Schema.Types.ObjectId,
                ref: "Patient"
            }
        ],
        userInfo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        DoctorKey:{
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

export const Doctor = mongoose.model("Doctor", doctorSchema)