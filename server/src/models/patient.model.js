import mongoose, {Schema} from "mongoose";


const patientSchema = new Schema(
    {
        Age:{
            type:String,
            required: true,
        },
        Sex:{
            type:String,
            required: true,
        },
        message:{
            type:String,
            required: true,
        },
        isPatient:{
            type:Boolean,
            required: true,
        },
        userInfo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        PatientKey:{
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

export const Patient = mongoose.model("Patient", patientSchema)
