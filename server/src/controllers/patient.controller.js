import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Doctor } from "../models/doctor.model.js"
import { Patient } from "../models/patient.model.js"
import { User } from "../models/user.model.js"

// Patient Register
const PatientRegister = asyncHandler(async (req, res) => {
    const { Age, Sex, message, PatientKey, location } = req.body;

    if ([Age, Sex, message, PatientKey, location].some((field) => typeof field !== "string" || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "User not found")
    
    if (!/^\d{6}$/.test(PatientKey)) {
        throw new ApiError(400, "PatientKey must be exactly 6 digits (numbers only)");
    }
    
    const existeduser = await Patient.findOne({ userInfo: user })
    if (existeduser) throw new ApiError(409, "Patient is already registered")

    const createdPatient = await Patient.create({
        Age,
        Sex,
        message,
        isPatient: true,
        PatientKey,
        location,
        userInfo: user,
        doctors: [],
        pendingDoctorRequests: []
    })
    
    const fullPatient = await createdPatient.populate("userInfo", "username fullname coverImage email phone avatar");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { Patient: fullPatient },
                "Patient registered successfully"
            )
        );
})

// Patient Login
const PatientLogin = asyncHandler(async (req, res) => {
    const { Patientkey } = req.body;
    const user = req.user?._id;
    
    if (!user) throw new ApiError(404, "User not found")
    if (!Patientkey) throw new ApiError(401, "Patient key required for login")
    
    const patient = await Patient.findOne({ userInfo: user })
        .populate("userInfo", "username fullname coverImage email phone avatar")
        .populate({
            path: "doctors",
            populate: {
                path: "userInfo",
                select: "username fullname coverImage email phone avatar"
            }
        })
        .populate({
            path: "pendingDoctorRequests",
            populate: {
                path: "userInfo",
                select: "username fullname coverImage email phone avatar"
            }
        });

    if (!patient) throw new ApiError(401, "Unauthorized access")

    const ispatientkeyvalid = await patient.ispatientkeyvalid(Patientkey)
    if (!ispatientkeyvalid) throw new ApiError(401, "Invalid patient credentials")
    
    patient.PatientKey = undefined;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { patient },
                "Patient login successful"
            )
        )
})

// ✅ NEW: Request Doctor (Patient sends request to Doctor)
const requestDoctor = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "User not found");

    const patient = await Patient.findOne({ userInfo: user });
    if (!patient) throw new ApiError(404, "Patient profile not found. Please register as a patient first.");

    const doctorId = req.params.id;
    if (!doctorId) throw new ApiError(400, "Doctor ID is required");

    // Check if already connected
    if (patient.doctors.includes(doctorId)) {
        throw new ApiError(400, "You are already connected to this doctor");
    }

    // Check if request already sent
    if (patient.pendingDoctorRequests.includes(doctorId)) {
        throw new ApiError(400, "Request already sent to this doctor");
    }

    // Add to doctor's pending requests
    const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { $addToSet: { pendingPatientRequests: patient._id } },
        { new: true }
    )
    .select("-DoctorKey")
    .populate("userInfo", "username fullname coverImage email phone avatar");

    if (!doctor) throw new ApiError(404, "Doctor does not exist");

    // Add to patient's pending requests
    await Patient.findByIdAndUpdate(
        patient._id,
        { $addToSet: { pendingDoctorRequests: doctorId } }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                doctor,
                "Request sent to doctor successfully"
            )
        );
});

// ✅ NEW: Cancel Doctor Request (Patient cancels pending request)
const cancelDoctorRequest = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "User not found");

    const patient = await Patient.findOne({ userInfo: user });
    if (!patient) throw new ApiError(404, "Patient profile not found");

    const doctorId = req.params.id;
    if (!doctorId) throw new ApiError(400, "Doctor ID is required");

    // Remove from patient's pending requests
    await Patient.findByIdAndUpdate(
        patient._id,
        { $pull: { pendingDoctorRequests: doctorId } },
        { new: true }
    );

    // Remove from doctor's pending requests
    await Doctor.findByIdAndUpdate(
        doctorId,
        { $pull: { pendingPatientRequests: patient._id } }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Request cancelled successfully"
            )
        );
});

// ✅ NEW: Remove Doctor (Patient removes connected doctor)
const removeDoctor = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "User not found");

    const patient = await Patient.findOne({ userInfo: user });
    if (!patient) throw new ApiError(404, "Patient profile not found");

    const doctorId = req.params.id;
    if (!doctorId) throw new ApiError(400, "Doctor ID is required");

    // Remove from patient's doctors
    await Patient.findByIdAndUpdate(
        patient._id,
        { $pull: { doctors: doctorId } },
        { new: true }
    );

    // Remove from doctor's patients
    await Doctor.findByIdAndUpdate(
        doctorId,
        { $pull: { patient: patient._id } }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Doctor removed successfully"
            )
        );
});

// Get Current Patient
const getCurrentPatient = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized request. User not found.");
    }

    const patient = await Patient.findOne({ userInfo: userId })
        .populate("userInfo", "fullname username email avatar phone coverImage")
        .populate({
            path: "doctors",
            populate: {
                path: "userInfo",
                select: "username fullname coverImage email phone avatar"
            }
        })
        .populate({
            path: "pendingDoctorRequests",
            populate: {
                path: "userInfo",
                select: "username fullname coverImage email phone avatar"
            }
        });

    if (!patient) {
        throw new ApiError(404, "Patient profile not found. Please register as a patient.");
    }

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

// ✅ NEW: Update Patient Profile
const updatePatientProfile = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");

    const { Age, Sex, message, location } = req.body;

    const patient = await Patient.findOne({ userInfo: userId });
    if (!patient) throw new ApiError(404, "Patient profile not found");

    // Update fields
    if (Age) patient.Age = Age;
    if (Sex) patient.Sex = Sex;
    if (message) patient.message = message;
    if (location) patient.location = location;

    await patient.save();

    const updatedPatient = await Patient.findById(patient._id)
        .populate("userInfo", "fullname username email avatar phone coverImage");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPatient,
                "Patient profile updated successfully"
            )
        );
});

export { 
    PatientLogin, 
    PatientRegister, 
    getCurrentPatient, 
    requestDoctor,
    cancelDoctorRequest,
    removeDoctor,
    updatePatientProfile
}