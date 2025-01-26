import { asynchandler } from "../utils/asynchandler.js"

import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apierror.js"
import { User } from "../models/user.model.js"


export const verifyJWT = asynchandler(async(req,res,next) =>{

  try {
    const  token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
  if(!token){
      throw new ApiError(401, "Unauthorized request")
  
  }
  
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
     const user =  await  User.findById(decodedToken?._id).select("-password -refreshToken")
     if (!user){
         throw new ApiError(404, "invalid access token")
  }
  
    req.user = user;
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Unauthorized")
  }
})

