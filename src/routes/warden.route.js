import { Router } from "express";
import { changePassword, loginWarden, logOutWarden, registerWarden, verifyWardenOtp } from "../controllers/warden.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerWarden)
router.route("/verifyMail").patch(verifyWardenOtp)
router.route("/login").post(loginWarden)
router.route("/logout").post(verifyJWT, logOutWarden)
router.route("/changePassword").patch(verifyJWT, changePassword)


export default router
