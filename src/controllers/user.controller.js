import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import{uploadoncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiresponse.js";


const registerUser = asynchandler(async(req, res) =>{
    const{fullname,email,username,password} =  req.body
    console.log("email" , email);
    if(
        [fullname, email, username,password].some((field) =>
            field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }

    const  existedUser =  await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists");
    }


  const avtarLocalPath =   req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avtarLocalPath){
throw new ApiError(400, "Avatar is required");
    }

 const avatar =   await uploadoncloudinary(avtarLocalPath)
 const coverImage = await uploadoncloudinary(coverImageLocalPath)

 if(!avatar ){
    throw new ApiError(500, "avatar is required");
 }

 const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
 })


 const createdUser = await User.findById(user._id)
  .select(
    "-password -refreshToken"
  )
  if(!createdUser){
      throw new ApiError(500, "User not created");
  }

return res.status(201).json(
    new ApiResponse(
        200, createdUser, "user registered successfully")
    )
})

export { registerUser }
