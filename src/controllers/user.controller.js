import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js" 
import {User} from "../model/user.model.js"
import {uploadOnCloudnary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler( async(req , res) =>{
    const {fullName, email ,username,password} = req.body
    console.log("email : " , email )


if(
    [fullName,email,username,password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400 ,"all field are required")
    }

const existedUser = User.findOne({
    $or : [{username} ,{email}]
})

if(existedUser){
    throw new ApiError (409, "User with emial or Username alreay existed")
}
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400 , "Avatar file is required")
}

const avatar = await uploadOnCloudnary(avatarLocalPath)
const coverImage = await uploadOnCloudnary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400 , "Avatar file is required")
}


const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username : username.tolowercase()
})
const createduser = User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createduser){
    throw new ApiError(500) , "Something went wrong while register a user"
}

return res.status(200).json(
     new ApiResponse (200, createduser , "User registerred successfully")
)
})


req.files?.avatar

export {registerUser}