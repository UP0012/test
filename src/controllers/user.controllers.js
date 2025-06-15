import asyncHandler from '../utils/asyncHandlers.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';
const generateAccessAndRefreshToken= async (userId) => {
    try{const user= await User.findById(userId);
        const refreshToken=user.generateRefreshToken();
        const accessToken=user.generateAccessToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
        }catch(error) {
            throw new ApiError(500,"something went wrong while generating access token and refresh token, please try again later")
        }
    }

const registerUser = asyncHandler(async (req, res) => {
console.log("IN")
    const { fullName, email,username, password } = req.body;

    if([fullName, email,username, password].some((field) => field?.trim() === "")) {
        throw new ApiError( 400,"Please fill all the fields");
    }
    const existedUser= await User.findOne({
        $or:[{email},{username}]
    })
    if(existedUser) {
        throw new ApiError(409,"User already exists");
    }
let avatarLocalPath;
if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
  avatarLocalPath = req.files.avatar[0].path;
} else {
  throw new ApiError(400, "Please upload your avatar");
}

//const coverImageLocalPath=req.files?.coverImage[0]?.path;

let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


// if(!avatarLocalPath) {
//     throw new ApiError(400,"Please upload your avatar");
// } 


const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);

if(!avatar) {
    throw new ApiError(500,"avatar file is required");
}
   
   const user=await User.create({
       fullName,
       email,
       username:username.toLowerCase(),
       password,
       avatar:avatar.url,
       coverImage:coverImage?.url||""
   })

   const createdUser=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser) {
        throw new ApiError(500,"something went wrong, please try again later");
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully")

    );

})
const loginUser = asyncHandler(async (req, res) => {
    const {email,username,password} = req.body;
    console.log("IN")
    if(!username && !email) {
        throw new ApiError(400,"Please fill all the fields")
    }
     const  user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user) {
        throw new ApiError(404,"User not found")
    }
    const isPaswordValid= await user.isPasswordCorrect(password);
    if(!isPaswordValid) {
        throw new ApiError(401,"Invalid password")
    }
//    const {accessToken,refreshToken}=await generateRefreshToken(user._id);
const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);


   const loggedInUser= await User.findById(user._id).select("-password -refreshToken");
   const options={
    httponly:true,
    secure:true,
   }
   return res.status(200)
   .cookie("refreshToken",refreshToken,options)
   .cookie("accessToken",accessToken,options)
   .json(
    new ApiResponse(200,
        {user: loggedInUser,refreshToken,accessToken},
    "User logged in successfully")
   );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: { refresh: undefined },
    }, {
        new: true,
    });
    const options={
    httponly:true,
    secure:true,
   }
   return res.status(200).clearCookie("refreshToken",options)
   .clearCookie("accessToken",options).
   json(new ApiResponse(200,null,"User logged out successfully"))
    
    });

    const refreshAccessToken = asyncHandler(async (req, res) => {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Please login first");
        }
        try {
            const decodedToken=jwt.verify(incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            )
            const user = await User.findById(decodedToken.id);
            if(!user){
                throw new ApiError(404, "User not found");
            }
            if(incomingRefreshToken !== user.refreshToken) {
                throw new ApiError(401, "refresh token expired, please login again");
            }
            const options = {
                httpOnly: true,
                secure: true,
            };
            const {accessToken,newrefreshToken}=await generateAccessAndRefreshToken(user._id)
            return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(new ApiResponse(200,
                 { accessToken, refreshToken: newrefreshToken },
                  "Access token refreshed successfully"));
    
    
        } catch (error) {
            throw new ApiError(401, "Invalid refresh token");
            
        }


    })

export { registerUser, logoutUser, loginUser ,refreshAccessToken};
