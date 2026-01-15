import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ComplaintAdmin } from "../models/complaintAdmin.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import { CyberUser} from "../models/cyberUser.model.js"
import mongoose from "mongoose"

//admin register
const adminregister = asyncHandler(async (req, res) => {
    const { category, Start_time, End_time, ComplaintAdminKey,location } = req.body
    if (
        [category, ComplaintAdminKey, Start_time, End_time, location].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All required fields must be non-empty");

    }

    const complaintAdmin_certificatepath = req.files?.complaintAdmin_certificate?.[0]?.path;
    console.log(complaintAdmin_certificatepath);
    
    if (!complaintAdmin_certificatepath) {
        throw new ApiError(400, "complaintAdmin_certificatepath is required");
    }

    

    const complaintAdmin_certificatePic = await uploadOnCloudinary(complaintAdmin_certificatepath);

    if (!complaintAdmin_certificatePic) throw new ApiError(500, "complaintAdmin_certificatepath upload failed")

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const existingcomplaint = await ComplaintAdmin.findOne({
        "userInfo._id": req.user?._id,
        iscomplaintAdmin: true
    });
    if (existingcomplaint) {
        throw new ApiError(409, "cyber user is already registered");
    }

    const { password, refreshToken, ...complaintData } = user; // bina kaam ke data ko htana

    // Create new complaint doc
    const complaintAdminn = await ComplaintAdmin.create({
        category,
        Start_time,
        End_time,
        ComplaintAdminKey,
        location,
        complaintAdmin_certificate: {
            url: complaintAdmin_certificatePic?.url || "",
            public_id: complaintAdmin_certificatePic?.public_id || "",
        },
        location,
        iscomplaintAdmin:true,
        userInfo: complaintData
    });

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            complaintAdminn,
            "complaintAdmin detail created successfully"
        ));
})

const adminlogin = asyncHandler(async (req, res) => {
    const {ComplaintAdminKey} = req.body
    if (
        [ComplaintAdminKey].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "fields must be non-empty");

    }

    const existingComplaint = await ComplaintAdmin.find({
         "ComplaintAdminKey": ComplaintAdminKey,
         iscomplaintAdmin: true
       });


    if (!existingComplaint) {
     throw new ApiError(409, "complaintkey is wrong");
   }

    return res
     .status(201)
     .json(new ApiResponse(
       201,
       existingComplaint,
       "login suceesfully"
     ));
})

const getAllcomplaint = asyncHandler(async (req, res) => {
    const existcomplaint = await ComplaintAdmin.find({});
    
  if (!existcomplaint) {
    throw new ApiError(404, "complaint not found or not registered as teacher");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      existcomplaint, 
      "All cyber fetched successfully"
    )
  );
});

const getbyusername = asyncHandler(async (req, res) => {
  const { username } = req.params; 

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const updatedComplaint = await ComplaintAdmin.findOne(
    { "userInfo.username": username.toLowerCase() }

  )//.select("-userInfo.password -userInfo.refreshToken -__v");

  if (!updatedComplaint) {
    throw new ApiError(404, "complaint not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedComplaint, "complaint find successfully")
  );
});

//by params id
const getuserbyid = asyncHandler(async (req, res) => {
  const  user  = req.user?._id; 
  console.log(user);

  if (!user) {
    throw new ApiError(400, "User is missing");
  }

  const updatedComplaint = await ComplaintAdmin.find(
    {"userInfo._id":user}
  )//.select("-userInfo.password -userInfo.refreshToken -__v");

  if (!updatedComplaint) {
    throw new ApiError(404, "complaint not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedComplaint, "complaint find successfully")
  );
});
const getDashboardData = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "User not found");

    // We find the admin and populate the 'AllComplaints' array
    // Assuming 'AllComplaints' stores objects with { userInfo: UserID, message: String, status: String }
    const admin = await ComplaintAdmin.findOne({ userInfo: user })
        .populate("userInfo", "username fullname email avatar phone")
        .populate({
            path: "AllComplaints.userInfo", // Populate the user details inside the complaints array
            select: "username fullname email avatar phone" 
        });

    if (!admin) {
        throw new ApiError(404, "Admin profile not found");
    }

    // Calculate basic stats for the frontend
    const total = admin.AllComplaints?.length || 0;
    const active = admin.AllComplaints?.filter(c => c.status === 'accepted').length || 0;
    const pending = admin.AllComplaints?.filter(c => c.status === 'pending').length || 0;

    return res.status(200).json(
        new ApiResponse(
            200, 
            { admin, stats: { total, active, pending } }, 
            "Dashboard data fetched successfully"
        )
    );
});

// 2. UPDATE COMPLAINT STATUS (Accept/Reject)
const updateComplaintStatus = asyncHandler(async (req, res) => {
    const { complaintId, status } = req.body; // complaintId is the _id of the sub-document in the array
    const user = req.user._id;

    if (!complaintId || !status) throw new ApiError(400, "Complaint ID and Status are required");

    const admin = await ComplaintAdmin.findOneAndUpdate(
        { 
            userInfo: user, 
            "AllComplaints._id": new mongoose.Types.ObjectId(complaintId) 
        },
        {
            $set: {
                "AllComplaints.$.status": status,
                // Optional: Update message if needed, or keep original
            }
        },
        { new: true }
    ).populate("AllComplaints.userInfo", "username fullname email avatar");

    if (!admin) throw new ApiError(404, "Complaint not found");

    return res.status(200).json(
        new ApiResponse(200, admin, `Complaint marked as ${status}`)
    );
});

export { adminregister,adminlogin,getAllcomplaint,getbyusername,getuserbyid,getDashboardData, 
    updateComplaintStatus}

   