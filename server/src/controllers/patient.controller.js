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
    if (!/^\d{6}$/.test(PatientKey)) {
        throw new ApiError(400, "PatientKey must be exactly 6 digits (numbers only)");
    }
    const existeduser = await Patient.findOne({ userInfo: user })
    if (existeduser) throw new ApiError(409, "patient is allready registered")

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
    const fullPatient = await createdPatient.populate("userInfo", "username fullname coverImage email phone avatar");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { Patient: fullPatient },
                "Patient registered succesfully"
            )
        );
})

//patient Login
const PatientLogin = asyncHandler(async (req, res) => {
    const { Patientkey } = req.body;
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "User not found")
    if (!Patientkey) throw new ApiError(401, "patient key required for login")
    const patient = await Patient.findOne({ userInfo: user })
        .populate("userInfo", "username fullname coverImage email phone avatar");

    if (!patient) throw new ApiError(401, "unauthorized access")

    const ispatientkeyvalid = await patient.ispatientkeyvalid(Patientkey)
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
const selectPatient = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "User not found");

    // 1. Get the Patient Profile of the logged-in user
    const patient = await Patient.findOne({ userInfo: user });
    if (!patient) throw new ApiError(404, "Patient profile not found. Please register as a patient first.");

    // 2. Get the Doctor ID from the URL (route: /select-patient/:id)
    const doc_id = req.params.id; // <--- THIS WAS MISSING
    
    if (!doc_id) throw new ApiError(400, "Doctor ID is required");

    // 3. Update the Doctor: Add patient's ID to the doctor's 'patient' array
    const doctor = await Doctor.findByIdAndUpdate(
        doc_id,
        { $addToSet: { patient: patient._id } }, // Push only the ID
        { new: true }
    )
    .select("-DoctorKey") // Security: hide key
    .populate("userInfo", "username fullname coverImage email phone avatar");

    if (!doctor) throw new ApiError(404, "Doctor does not exist");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                doctor,
                "Patient successfully added to Doctor's list"
            )
        );
});

const getCurrentPatient = asyncHandler(async (req, res) => {
    // 1. Get the User ID from the verifyJWT middleware
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized request. User not found.");
    }

    // 2. Find the Patient profile linked to this User
    const patient = await Patient.findOne({ userInfo: userId })
        .populate("userInfo", "fullName email avatar phone"); // Fetch user details

    if (!patient) {
        throw new ApiError(404, "Patient profile not found. Please register as a patient.");
    }

    // 3. Return the data
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                patient, 
                "Patient profile fetched successfully"
            )
        );
});
export { PatientLogin, PatientRegister,getCurrentPatient, selectPatient }

