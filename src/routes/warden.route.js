import { Router } from "express";
import { loginWarden, registerWarden, verifyWardenOtp } from "../controllers/warden.controller.js";


const router = Router();

router.route("/register").post(registerWarden)
router.route("/verifyMail").patch(verifyWardenOtp)
router.route("/login").post(loginWarden)


export default router
