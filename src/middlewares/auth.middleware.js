import asyncHandler from '../utils/asyncHandlers.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';




export const verifyJWT= asyncHandler(async(req,res,next)=>{
   try {
     const token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ", "").trim();
     

     if(!token) {
         return next(new ApiError(401,"You are not authorized to access this resource"));
     }
     const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
    const user=await User.findById(decodedToken?.id).select("-password -refreshToken")
         if(!user) {
             return next(new ApiError(401,"You are not authorized to access this resource"));
         }
         req.user=user;
         next();
     }
    catch (error) {
       throw new ApiError(401,error?.message ||
        
        
        
        
        
        
        "Invalid Acess Token")
   }
})

export default verifyJWT;