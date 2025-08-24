import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { ComplaintUser } from "../models/complaintUser.model.js"

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

export { userregister, UserLogin, selecteduser, getuserbyid }

