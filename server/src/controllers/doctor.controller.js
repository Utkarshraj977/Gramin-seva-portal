import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Doctor } from "../models/doctor.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

//doctorRegister
const doctorRegister = asyncHandler(async (req, res) => {
    const { Experience, Type, category, Start_time, End_time, isDoctor, patient, DoctorKey, location } = req.body;

    if ([Experience, Type, category, isDoctor, patient, DoctorKey, location].some((field) => typeof field !== "string" || field.trim() === "") || typeof isDoctor !== "boolean") {
        throw new ApiError(400, "All fields are required");
    }
    if (!/^\d{6}$/.test(DoctorKey)) {
        throw new ApiError(400, "DoctorKey must be exactly 6 digits (numbers only)");
    }

    const Doctor_certificate_localpath = req.files?.Doctor_certificate?.[0]?.path;

    if (!Doctor_certificate_localpath) {
        throw new ApiError(400, "Doctor certificate is required");
    }

    const upload = await uploadOnCloudinary(Doctor_certificate_localpath);
    if (!upload) throw new ApiError(400, "Certification upload failed");

    const createdDoctor = await Doctor.create(
        {
            Doctor_certificate: upload.url,
            Experience,
            Type,
            category,
            Start_time,
            End_time,
            isDoctor,
            patient,
            DoctorKey,
            location,
            userInfo: req.user._id
        }
    )
    const fullDoctor = await createdDoctor.populate("userInfo", "username fullname coverImage email phone avatar ");

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { doctor: fullDoctor },
                "User registered successfully"
            )
        );
})

//doctorLogin

const doctorLogin = asyncHandler(async (req, res) => {
    const { DoctorKey } = req.body
    const userId = req.user._id

    if (!DoctorKey) throw new ApiError(401, "Doctor key required for login")

    const doctor = await Doctor.findOne({ userInfo: userId })
        .populate("userInfo", "username fullname coverImage email phone avatar")

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

export {doctorLogin,doctorRegister} 


