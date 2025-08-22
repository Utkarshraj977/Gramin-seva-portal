import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Doctor } from "../models/doctor.model.js"
import { Patient } from "../models/patient.model.js"

//patient Register
const PatientRegister = asyncHandler(async (req, res) => {
    const { Age, Sex, message, PatientKey, location } = req.body;

    if ([Age, Sex, message, PatientKey, location].some((field) => typeof field !== "string" || field.trim() === "")) {
        throw new ApiError(400, "All fields are reqired");
    }
    const user = req.user?._id;

    if (!user) throw new ApiError(404, "User not found")

    const existeduser=await Patient.findOne({userInfo:user})    
    if(existeduser) throw new ApiError(409,"patient is allready registered")
        
    const createdPatient = await Patient.create(
        {
            Age,
            Sex,
            message,
            isPatient: true,
            PatientKey,
            location,
            userInfo: user
        }
    )
    const fullPatient=await createdPatient.populate("userInfo", "username fullname coverImage email phone avatar");

    return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {Patient:fullPatient},
                    "Patient registered succesfully"
                )
            );
})

//patient Login
const PatientLogin=asyncHandler(async(req,res)=>{
    const {Patientkey}  =req.body;
    const user=req.user?._id;
    if(!user) throw new ApiError(404,"User not found")
    if (!Patientkey) throw new ApiError(401, "patient key required for login") 
    const patient = await Patient.findOne({ userInfo: user })
    .populate("userInfo", "username fullname coverImage email phone avatar");

    if(!patient) throw new ApiError(401,"unauthorized access")
    
    const ispatientkeyvalid=await patient.ispatientkeyvalid(Patientkey)    
    if (!ispatientkeyvalid) throw new ApiError(401, "Invalid patient credentials")
    patient.PatientKey = undefined; //remove to send the key in the response

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { patient },
                "patient login successful"
            )
        )
        
})

//selectedpatient
const selectPatient=asyncHandler(async (req,res) => {
    const user=req.user?._id;
    if(!user) throw new ApiError(404,"user not found")

    const patient=await Patient.findOne({userInfo:user}).populate("userInfo","username fullname coverImage email phone avatar")
    if (!patient) throw new ApiError(404, "Patient profile not found. Please register as a patient first.");

    const patientid=patient?._id
     
    console.log(patient);
   // const patientid=patient?._id
        
    const doc_id=req.params.id;
    const doctor=await Doctor.findByIdAndUpdate(
        doc_id,
        {$addToSet:{patient:patient}},
        {new:true}
    )
    if(!doctor) throw new ApiError(404,"Doctor not exist");

    return res
           .status(200)
           .json(
             new ApiResponse(
                200,
                doctor,
                "patient is added in doctor"
             )
           )
})

export {PatientLogin,PatientRegister,selectPatient}

