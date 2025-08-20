import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"

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
            required:true,
            match: [/^\d{6}$/, "DoctorKey must be exactly 6 digits"],
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

patientSchema.pre("save",async function (next){
    if(!this.isModified("PatientKey")) return next();

    this.PatientKey=await bcrypt.hash(this.PatientKey,10)
    next()
})

patientSchema.methods.ispatientkeyvalid= async function(PatientKey){
    return await bcrypt.compare(PatientKey,this.PatientKey)
}

export const Patient = mongoose.model("Patient", patientSchema)
