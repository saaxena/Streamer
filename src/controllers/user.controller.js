import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import{uploadoncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiresponse.js";


const generateAccessandRefreshToken  = async(userId) =>{
    try{
    const user =  await User.findByIdAndUpdate(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    

user.refreshToken = refreshToken
await user.save({validateBeforeSave: false})
 return {accessToken, refreshToken}
       }   catch(error)
{
    throw new ApiError(500, "Token generation failed")
}
}





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
const loginUser = asynchandler(async(req,res) =>{
   const{email, username,password} = req.body
   if(!(username|| email))
   {
    throw new ApiError(400, "username or email is required");
   }
 const user = await User.findOne({
      $or :[
        {username},
        {email}
      ]
   })
   // Add your login logic here
  
   if(!user){
    throw new ApiError(404, "User not found");
   }


const passwordVALID = await user.checkpassword(password)
if(!passwordVALID){
    throw new ApiError(401, "Invalid credentials");
}
const {accessToken,refreshToken}  =  await generateAccessandRefreshToken(user._id)
const loggeduser = await User.findById(user._id).
select("-password -refreshToken")



const options = {
    httpOnly: true,
    secure : true
}
 return res.status(200).cookie("accessToken", accessToken, options).cookie
    ("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {
            user: loggeduser, accessToken, refreshToken},
             "user logged in successfully"
    )
    )

})


const loggedoutuser = asynchandler(async(req,res) =>{
await User.findByIdAndUpdate(
    req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true
    }
)

const options = {
    httpOnly: true,
    secure : true
}
return res.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, {}, "user logged out successfully"))


})
export{loginUser}
export { registerUser}
export {loggedoutuser}
