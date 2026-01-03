import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";
import { generateOTP, hashOTP } from "../utils/otp.js";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password,phone } = req.body;


  if (
    [fullName, email, username, password,phone].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields must be non-empty strings");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }, {phone}],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // ✅ File path extraction
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }


  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // User create
  const user = await User.create({
    fullName,
    email,
    phone,
    password,
    username: username.toLowerCase(),
    avatar: {
      url: avatar?.url || "",
      public_id: avatar?.public_id || "",
    },
    coverImage: {
      url: coverImage?.url || "",
      public_id: coverImage?.public_id || "",
    }
  });



  // Remove password & refreshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -otp"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdUser,
        "User registered successfully"
      )
    );
});



// const registerUser = asyncHandler(async (req, res) => {
//   const { fullName, email, username, password, phone } = req.body;

//   // 1️⃣ Basic validation
//   if (
//     [fullName, email, username, password, phone].some(
//       (field) => typeof field !== "string" || field.trim() === ""
//     )
//   ) {
//     throw new ApiError(400, "All fields must be non-empty strings");
//   }

//   // 2️⃣ Existing user check
//   const existedUser = await User.findOne({
//     $or: [{ username }, { email }, { phone }],
//   });

//   if (existedUser) {
//     throw new ApiError(409, "User with email / username / phone already exists");
//   }

//   // 3️⃣ File extraction
//   let coverImageLocalPath;
//   if (
//     req.files &&
//     Array.isArray(req.files.coverImage) &&
//     req.files.coverImage.length > 0
//   ) {
//     coverImageLocalPath = req.files.coverImage[0].path;
//   }

//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar file is required");
//   }

//   // 4️⃣ Upload to Cloudinary
//   const avatar = await uploadOnCloudinary(avatarLocalPath);
//   const coverImage = coverImageLocalPath
//     ? await uploadOnCloudinary(coverImageLocalPath)
//     : null;

//   if (!avatar) {
//     throw new ApiError(400, "Avatar upload failed");
//   }

//   // 🔐 5️⃣ OTP GENERATION
//   const otp = generateOTP();              // 6 digit
//   const hashedOTP = hashOTP(otp);         // sha256
//   const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//   // 6️⃣ User creation (OTP fields added)
//   const user = await User.create({
//     fullName,
//     email,
//     phone,
//     password,
//     username: username.toLowerCase(),

//     avatar: {
//       url: avatar.url,
//       public_id: avatar.public_id,
//     },

//     coverImage: coverImage
//       ? {
//           url: coverImage.url,
//           public_id: coverImage.public_id,
//         }
//       : undefined,

//     emailVerified: false,
//     emailVerificationOTP: hashedOTP,
//     emailVerificationExpiry: otpExpiry,
//   });

//   // 7️⃣ Send OTP Email
//   const mailSent = await sendMail(
//     email,
//     "Verify your Email - Gramin Seva",
//     `Hello ${fullName},

// Your OTP for email verification is: ${otp}

// ⏱️ Valid for 10 minutes.

// If you did not register, please ignore this email.

// – Gramin Seva Team`
//   );

//   if (!mailSent) {
//     throw new ApiError(500, "User created but failed to send OTP email");
//   }

//   // 8️⃣ Response (sensitive fields removed)
//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken -emailVerificationOTP -emailVerificationExpiry"
//   );

//   return res.status(201).json(
//     new ApiResponse(
//       201,
//       createdUser,
//       "User registered successfully. OTP sent to email."
//     )
//   );
// });


const loginUser = asyncHandler(async (req, res) =>{

    const {email, username, password} = req.body
    console.log(username);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: false,     // localhost
      sameSite: "lax",   // VERY IMPORTANT
    };


    // if (!user.isVerified) {
    // return res.status(403).json({ message: "Email not verified. Please verify first." });
    // }


    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
      httpOnly: true,
      secure: false,     // localhost
      sameSite: "lax",   // VERY IMPORTANT
    };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const user = await User.findById(req.user._id);

 
  // if (user?.avatar?.public_id) {
  //   await cloudinary.uploader.destroy(user.avatar.public_id);
  //   console.log("old file delete");
    
  // }

  // ✅ Step 2: Upload new avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar?.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  // ✅ Step 3: Update DB with new avatar info
  user.avatar = {
    url: avatar.url,
    public_id: avatar.public_id,
  };
  await user.save();

  const updatedUser = await User.findById(req.user._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const user = await User.findById(req.user._id);

  //  Optional: delete old image check krna hai




  // if (user?.coverImage?.public_id) {
  //   await cloudinary.uploader.destroy(user.coverImage.public_id);
  //   console.log("Old cover image deleted");
  // }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading cover image");
  }

  //  Update DB
  user.coverImage = {
    url: coverImage.url,
    public_id: coverImage.public_id
  };

  await user.save();

  const updatedUser = await User.findById(req.user._id).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Cover image updated successfully")
    );
});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})
const getUserByID = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!userId) {
        throw new ApiError(400, "User ID is required")
    }

    const user = await User.findById(userId)
        .select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    )
})


export {registerUser,loginUser,logoutUser,changeCurrentPassword,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getCurrentUser,getUserByID}