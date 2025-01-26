import { loginUser, loggedoutuser, registerUser } from "../controllers/user.controller.js";
import { Router } from "express";
import {upload} from "../middlewares/multer.controller.js"
import { verifyJWT } from "../middlewares/authenticate.js";






const router = Router()

router.route ("/register").post(
    
    upload.fields([
        {
name : "avatar",
maxCount:1
        },
    {
        name: "coverImage",
        maxCount: 1
    }
    ]),
    registerUser
)


router.route("/login").post(loginUser)


router.route("/logout").post(verifyJWT,loggedoutuser)


export default router