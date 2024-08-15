import { Router } from "express";
import { changePassword, loginWarden, logOutWarden, regenerateOtp, registerWarden, updatePhoneNo, verifyWardenOtp } from "../controllers/warden.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerWarden)
router.route("/verifyMail").patch(verifyWardenOtp)
router.route('/regenerateOtp').patch(regenerateOtp)

router.route("/login").post(loginWarden)
router.route("/logout").post(verifyJWT, logOutWarden)

router.route("/changePassword").patch(verifyJWT, changePassword)
router.route("/updatePhoneNumber").patch(verifyJWT, updatePhoneNo)


export default router
