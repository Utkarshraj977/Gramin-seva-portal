import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ComplaintUser } from "../models/complaintUser.model.js";
import { ComplaintAdmin } from "../models/complaintAdmin.model.js";

//ComplaintUser Register
const userregister = asyncHandler(async (req, res) => {
    const {message,ComplaintUserKey, location } = req.body;

    if ([ message,ComplaintUserKey, location].some((field) => typeof field !== "string" || field.trim() === "")) {
        throw new ApiError(400, "All fields are reqired");
    }
    const user = req.user?._id;

    if (!user) throw new ApiError(404, "User not found")
    if (!/^\d{6}$/.test(ComplaintUserKey)) {
        throw new ApiError(400, "ComplaintUserKey must be exactly 6 digits (numbers only)");
    }
    const existeduser = await ComplaintUser.findOne({ userInfo: user })
    if (existeduser) throw new ApiError(409, "complaint user is allready registered")

    const createdUser = await ComplaintUser.create(
        {
            message,
            isPatient: true,
            ComplaintUserKey,
            location,
            isComplaintUser:true,
            userInfo: user
        }
    )
    const fulluser = await createdUser.populate("userInfo", "username fullname coverImage email phone avatar");
    fulluser.ComplaintUserKey=null;
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { ComplaintUser: fulluser },
                "ComplaintUser registered succesfully"
            )
        );
})

//ComplaintUser Login
const UserLogin = asyncHandler(async (req, res) => {
    const { ComplaintUserKey } = req.body;
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "User not found")
    if (!ComplaintUserKey) throw new ApiError(401, "ComplaintUser key required for login")

    const complaintuser = await ComplaintUser.findOne({ userInfo: user })
        .populate("userInfo", "username fullname coverImage email phone avatar");

    if (!complaintuser) throw new ApiError(401, "unauthorized access")

    const isKeyCorrect = await complaintuser.isKeyCorrect(ComplaintUserKey)
    if (!isKeyCorrect) throw new ApiError(401, "Invalid ComplaintUser credentials")
    //ComplaintUser.ComplaintUserKey = undefined; //remove to send the key in the response

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { complaintuser },
                "complaint user login successful"
            )
        )

})

//selectedpatient
const selecteduser = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    if (!user) throw new ApiError(404, "user not found")

    const complaintuser = await ComplaintUser.findOne({ userInfo: user }).populate("userInfo", "username fullname coverImage email phone avatar")
    if (!complaintuser) throw new ApiError(404, "ComplaintUser profile not found. Please register as a ComplaintUser first.");

    const admin = req.params.id;
    const ComplaintUser = await ComplaintUser.findByIdAndUpdate(
        admin,
        { $addToSet: { ComplaintUser: complaintuser } },
        { new: true }
    )
    .select("-ComplaintUserKey")  // hide Key
 
    if (!ComplaintUser) throw new ApiError(404, "admin not found");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                ComplaintUser,
                "ComplaintUser is added in complaintAdmin"
            )
        )
})

//get user by id
const getuserbyid=asyncHandler(async(req,res)=>{
    const user=req.user?._id;
    if(!user) throw new ApiError(400,"user not found")
    
    const complaintuser=await ComplaintUser.findOne({userInfo:user})
    .populate("userInfo","username fullname coverImage email phone avatar")    
    complaintuser.ComplaintUserKey=undefined;
    if(!complaintuser) throw new ApiError(404,"complaint User not found")

    return res
         .status(201)    
         .json(
            new ApiResponse(200,complaintuser,"complaint user fetched succesfullly")
         )

})

const requestConnection = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const adminId = req.params.id; // The Admin ID user wants to connect to

    // Find the User's Complaint Profile
    const complaintUser = await ComplaintUser.findOne({ userInfo: userId });
    if (!complaintUser) throw new ApiError(404, "Please register as a Complaint User first.");

    // Update ComplaintUser with the target Admin and set status to PENDING
    // We assume ComplaintUser model has fields: assignedAdmin, requestStatus
    complaintUser.assignedAdmin = adminId;
    complaintUser.requestStatus = "pending"; 
    await complaintUser.save();

    // OPTIONAL: Push to Admin's pending list if your schema relies on arrays
    // But it's better to just query ComplaintUser by assignedAdmin later
    
    return res.status(200).json(
        new ApiResponse(200, complaintUser, "Connection request sent to Authority.")
    );
});

// 2. Admin ACCEPTS Request (New)
const acceptRequest = asyncHandler(async (req, res) => {
    const { complaintUserId } = req.body; // The ID of the ComplaintUser (Citizen)
    
    const complaintUser = await ComplaintUser.findById(complaintUserId);
    if (!complaintUser) throw new ApiError(404, "Complaint User not found");

    complaintUser.requestStatus = "accepted";
    await complaintUser.save();

    // Now we add it to the Admin's "Active List" for record keeping if needed
    const admin = await ComplaintAdmin.findById(complaintUser.assignedAdmin);
    if(admin) {
        // Ensure we don't duplicate
        const isAlreadyAdded = admin.ComplaintUser.some(id => id.toString() === complaintUserId);
        if (!isAlreadyAdded) {
            admin.ComplaintUser.push(complaintUser._id);
            await admin.save();
        }
    }

    return res.status(200).json(
        new ApiResponse(200, complaintUser, "Request Accepted. Chat enabled.")
    );
});

const getMyStatus = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    // Find my complaint profile and populate the admin I am connected to
    const myProfile = await ComplaintUser.findOne({ userInfo: userId }).populate("assignedAdmin");
    
    if(!myProfile) return res.status(200).json(new ApiResponse(200, null, "No profile"));

    return res.status(200).json(
        new ApiResponse(200, myProfile, "Fetched status")
    );
});


export { requestConnection, acceptRequest, getMyStatus, userregister, UserLogin, getuserbyid };
