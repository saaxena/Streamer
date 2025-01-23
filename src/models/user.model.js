import mongoose, {Schema} from "mongoose";


const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 4,
            index: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        fullname:{
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar:{
            type: String, //string url
            required: true
        },
        coverimage:{
            type: String, //string url
        },
        watchHistory:{
            type: Schema.Types.ObjectId,
            ref:"video"
        },
        password:{
            type: String,
            required:[ true,"password is required"],
            minlength: 8
            
        },
        refreshToken:{
            type: String
        }
    },
    {
        timestamps: true
    
    }



)



export const User = mongoose.model("User", userSchema)