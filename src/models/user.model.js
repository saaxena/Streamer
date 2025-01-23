import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


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

userSchema.pre("save", async function (next){
    if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})
userSchema.methods.checkPassword  = async function(password){
    return  await bcrypt.compareSync(password, this.password)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id: this._id,
       
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET
        }

    )
}
    
export const User = mongoose.model("User", userSchema)