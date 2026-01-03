import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Doctor } from "../models/doctor.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"

//doctorRegister
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
    if (existeduser) throw new ApiError(409, "Doctor is allready registered")

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
            isDoctor: true,
            DoctorKey,
            location,
            userInfo: user
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
    const userId = req.user?._id
    if (!userId) throw new ApiError(404, "user not found")

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

//getalldoctor
const getalldoctor = asyncHandler(async (req, res) => {

    const Alldoctor = await Doctor.find()
        .populate("userInfo", "username fullname coverImage email phone avatar")


    if (!Alldoctor || Alldoctor.length === 0) {
        throw new ApiError(404, "No doctors found ");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                 Alldoctor 
                , "All Doctor fetched succesfully"
            )
        )

})

//getsingledoctorbyid(params) 
const getdoctorbyid = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const doctor = await Doctor.findById(id).populate(
        "userInfo",
        "username fullname coverImage email phone avatar"
    );

    if (!doctor) throw new ApiError(404, "Doctor not found");

    return res.status(200).json(
        new ApiResponse(
            200,
            { doctor },
            "Doctor found successfully"
        )
    );
});

//delete patient(jiska service ho gya hai usse delete kr de)
const deleteServePatient = asyncHandler(async (req, res) => {
    const { patientid } = req.params
    const user = req.user._id
    if (!patientid) throw new ApiError(400, "Patient ID is required");
    if (!user) throw new ApiError(400, "user id not found")


    const doctor = await Doctor.findOneAndUpdate(
        {
            userInfo: user,
            "patient._id": patientid // check karega ki patient array me hai ya nahi
        },
        { $pull: { patient:{_id:patientid}} },  //delete full object of the patient
        { new: true }
    ).populate(
        "userInfo",
        "username fullname coverImage email phone avatar"
    );

if (!doctor) throw new ApiError(404, "Doctor not found or patient not associated");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                doctor,
                "doctor updated succesfully"
            )
        )
})

//filter doctor
//by category
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
            $unwind: "$userdetails" // convert array -> object
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
                "All doctor fetched successfully by category"
            )
        );
})

//by Types => Human Doctor or Animal Doctor aur anything else Doctor
const alldoctorbytype = asyncHandler(async (req, res) => {
    const type = req.params.type;
    if (!type) throw new ApiError(404, "type is required")

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
                "All doctor o fthis type issuccesfully fetched"
            )
        )
})

const getCurrentDoctor = asyncHandler(async (req, res) => {
    const user = req.user._id;
    
    const doctor = await Doctor.findOne({ userInfo: user })
        // 1. Populate the DOCTOR'S own info (Name, Avatar, etc.)
        .populate("userInfo", "fullName username email avatar") 
        
        // 2. Populate the PATIENTS list
        .populate({
            path: "patient", 
            populate: {
                path: "userInfo", 
                select: "username fullName email avatar phone" 
            }
        });

    if (!doctor) throw new ApiError(404, "Doctor profile not found");

    return res.status(200).json(new ApiResponse(200, doctor, "Doctor profile fetched"));
});

export { doctorLogin, doctorRegister, getalldoctor,getCurrentDoctor,alldoctorbytype, alldoctorbycatog, deleteServePatient, getdoctorbyid, }


