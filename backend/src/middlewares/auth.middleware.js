import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
export const verifyJWT=asyncHandler(async(req,res,next)=>{
 try {
    const token =req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    if (!token) {
        throw new ApiError(401, "Access token is missing");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select('-password -refreshToken');
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    req.user = user;
    next();
 } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
 }
});
