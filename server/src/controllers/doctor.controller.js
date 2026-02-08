import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Doctor } from "../models/doctor.model.js"
import { Patient } from "../models/patient.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"

// Doctor Register
const doctorRegister = asyncHandler(async (req, res) => {
    const { Experience, Type, category, Start_time, End_time, DoctorKey, location } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    if ([Experience, Type, category, DoctorKey, location].some((field) => typeof field !== "string" || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    
    if (!/^\d{6}$/.test(DoctorKey)) {
        throw new ApiError(400, "DoctorKey must be exactly 6 digits (numbers only)");
    }

    const existeduser = await Doctor.findOne({ userInfo: user })
    if (existeduser) throw new ApiError(409, "Doctor is already registered")

    const Doctor_certificate_localpath = req.files?.Doctor_certificate?.[0]?.path;

    if (!Doctor_certificate_localpath) {
        throw new ApiError(400, "Doctor certificate is required");
    }

    const upload = await uploadOnCloudinary(Doctor_certificate_localpath);
    if (!upload) throw new ApiError(400, "Certification upload failed");

    const createdDoctor = await Doctor.create({
        Doctor_certificate: upload.url,
        Experience,
        Type,
        category,
        Start_time,
        End_time,
        isDoctor: true,
        DoctorKey,
        location,
        userInfo: user,
        patient: [],
        pendingPatientRequests: []
    })
    
    const fullDoctor = await createdDoctor.populate("userInfo", "username fullname coverImage email phone avatar");

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { doctor: fullDoctor },
                "Doctor registered successfully"
            )
        );
})

// Doctor Login
const doctorLogin = asyncHandler(async (req, res) => {
    const { DoctorKey } = req.body
    const userId = req.user?._id
    if (!userId) throw new ApiError(404, "User not found")

    if (!DoctorKey) throw new ApiError(401, "Doctor key required for login")

    const doctor = await Doctor.findOne({ userInfo: userId })
        .populate("userInfo", "username fullname coverImage email phone avatar")
        .populate({
            path: "patient",
            populate: {
                path: "userInfo",
                select: "username fullname coverImage email phone avatar"
            }
        })
        .populate({
            path: "pendingPatientRequests",
            populate: {
                path: "userInfo",
                select: "username fullname coverImage email phone avatar"
            }
        });

    if (!doctor) throw new ApiError(404, "Doctor not found")

    const isDoctorkeyvalid = await doctor.isDoctorKeyCorrect(DoctorKey)
    if (!isDoctorkeyvalid) throw new ApiError(401, "Invalid doctor credentials")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { doctor },
                "Doctor login successful"
            )
        )
})

// ✅ NEW: Accept Patient Request
const acceptPatientRequest = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(404, "User not found");

    const doctor = await Doctor.findOne({ userInfo: userId });
    if (!doctor) throw new ApiError(404, "Doctor profile not found");

    const patientId = req.params.id;
    if (!patientId) throw new ApiError(400, "Patient ID is required");

    // Check if request exists
    if (!doctor.pendingPatientRequests.includes(patientId)) {
        throw new ApiError(400, "No pending request from this patient");
    }

    // Move from pending to accepted
    await Doctor.findByIdAndUpdate(
        doctor._id,
        {
            $pull: { pendingPatientRequests: patientId },
            $addToSet: { patient: patientId }
        }
    );

    // Update patient's side
    await Patient.findByIdAndUpdate(
        patientId,
        {
            $pull: { pendingDoctorRequests: doctor._id },
            $addToSet: { doctors: doctor._id }
        }
    );

    const updatedDoctor = await Doctor.findById(doctor._id)
        .populate("userInfo", "username fullname coverImage email phone avatar")
        .populate({
            path: "patient",
            populate: {
                path: "userInfo",
                select: "username fullname coverImage email phone avatar"
            }
        })
        .populate({
            path: "pendingPatientRequests",
            populate: {
                path: "userInfo",
                select: "username fullname coverImage email phone avatar"
            }
        });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedDoctor,
                "Patient request accepted successfully"
            )
        );
});

// ✅ NEW: Reject Patient Request
const rejectPatientRequest = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(404, "User not found");

    const doctor = await Doctor.findOne({ userInfo: userId });
    if (!doctor) throw new ApiError(404, "Doctor profile not found");

    const patientId = req.params.id;
    if (!patientId) throw new ApiError(400, "Patient ID is required");

    // Remove from doctor's pending requests
    await Doctor.findByIdAndUpdate(
        doctor._id,
        { $pull: { pendingPatientRequests: patientId } }
    );

    // Remove from patient's pending requests
    await Patient.findByIdAndUpdate(
        patientId,
        { $pull: { pendingDoctorRequests: doctor._id } }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Patient request rejected successfully"
            )
        );
});

// Get All Doctors
const getalldoctor = asyncHandler(async (req, res) => {
    const Alldoctor = await Doctor.find()
        .populate("userInfo", "username fullname coverImage email phone avatar")
        .select("-DoctorKey");

    if (!Alldoctor || Alldoctor.length === 0) {
        throw new ApiError(404, "No doctors found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                Alldoctor,
                "All doctors fetched successfully"
            )
        )
})

// Get Single Doctor By ID
const getdoctorbyid = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const doctor = await Doctor.findById(id)
        .populate("userInfo", "username fullname coverImage email phone avatar")
        .select("-DoctorKey");

    if (!doctor) throw new ApiError(404, "Doctor not found");

    return res.status(200).json(
        new ApiResponse(
            200,
            { doctor },
            "Doctor found successfully"
        )
    );
});

// Remove Patient (Doctor removes connected patient)
const removePatient = asyncHandler(async (req, res) => {
    const { patientid } = req.params
    const user = req.user._id
    
    if (!patientid) throw new ApiError(400, "Patient ID is required");
    if (!user) throw new ApiError(400, "User ID not found")

    const doctor = await Doctor.findOne({ userInfo: user });
    if (!doctor) throw new ApiError(404, "Doctor not found");

    // Remove from doctor's patients
    await Doctor.findByIdAndUpdate(
        doctor._id,
        { $pull: { patient: patientid } }
    );

    // Remove from patient's doctors
    await Patient.findByIdAndUpdate(
        patientid,
        { $pull: { doctors: doctor._id } }
    );

    const updatedDoctor = await Doctor.findById(doctor._id)
        .populate("userInfo", "username fullname coverImage email phone avatar")
        .populate({
            path: "patient",
            populate: {
                path: "userInfo",
                select: "username fullname coverImage email phone avatar"
            }
        });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedDoctor,
                "Patient removed successfully"
            )
        )
})

// Filter: Doctors by Category
const alldoctorbycatog = asyncHandler(async (req, res) => {
    const category = req.params.category
    if (!category) throw new ApiError(400, "Category is required");
    
    const alldoctor = await Doctor.aggregate([
        {
            $match: { category: category }
        },
        {
            $lookup: {
                from: "users",
                localField: "userInfo",
                foreignField: "_id",
                as: "userdetails"
            }
        },
        {
            $unwind: "$userdetails"
        },
        {
            $project: {
                "userdetails.password": 0,
                "userdetails.refreshToken": 0,
                "DoctorKey": 0
            }
        }
    ]);

    if (!alldoctor || alldoctor.length === 0) {
        throw new ApiError(404, "No doctors found in this category");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                alldoctor,
                "All doctors fetched successfully by category"
            )
        );
})

// Filter: Doctors by Type
const alldoctorbytype = asyncHandler(async (req, res) => {
    const type = req.params.type;
    if (!type) throw new ApiError(404, "Type is required")

    const alldoctor = await Doctor.aggregate([
        {
            $match: { Type: type }
        },
        {
            $lookup: {
                from: "users",
                localField: "userInfo",
                foreignField: "_id",
                as: "userdetails"
            }
        },
        {
            $unwind: "$userdetails"
        },
        {
            $project: {
                "userdetails.password": 0,
                "userdetails.refreshToken": 0,
                "DoctorKey": 0
            }
        }
    ]);

    if (!alldoctor || alldoctor.length === 0) {
        throw new ApiError(404, "No doctor found in this type");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                alldoctor,
                "All doctors of this type fetched successfully"
            )
        )
})

// Get Current Doctor
const getCurrentDoctor = asyncHandler(async (req, res) => {
    const user = req.user._id;
    
    const doctor = await Doctor.findOne({ userInfo: user })
        .populate("userInfo", "fullname username email avatar coverImage phone")
        .populate({
            path: "patient",
            populate: {
                path: "userInfo",
                select: "username fullname email avatar phone"
            }
        })
        .populate({
            path: "pendingPatientRequests",
            populate: {
                path: "userInfo",
                select: "username fullname email avatar phone"
            }
        });

    if (!doctor) throw new ApiError(404, "Doctor profile not found");

    return res.status(200).json(
        new ApiResponse(200, doctor, "Doctor profile fetched successfully")
    );
});

// ✅ NEW: Update Doctor Profile
const updateDoctorProfile = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");

    const { Experience, Type, category, Start_time, End_time, location } = req.body;

    const doctor = await Doctor.findOne({ userInfo: userId });
    if (!doctor) throw new ApiError(404, "Doctor profile not found");

    // Update fields
    if (Experience) doctor.Experience = Experience;
    if (Type) doctor.Type = Type;
    if (category) doctor.category = category;
    if (Start_time) doctor.Start_time = Start_time;
    if (End_time) doctor.End_time = End_time;
    if (location) doctor.location = location;

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctor._id)
        .populate("userInfo", "fullname username email avatar phone coverImage");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedDoctor,
                "Doctor profile updated successfully"
            )
        );
});

export { 
    doctorLogin, 
    doctorRegister, 
    getalldoctor,
    getCurrentDoctor,
    alldoctorbytype, 
    alldoctorbycatog, 
    removePatient,
    getdoctorbyid,
    acceptPatientRequest,
    rejectPatientRequest,
    updateDoctorProfile
}