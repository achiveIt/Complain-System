import { Router } from "express";
import { registerWarden, verifyWardenOtp } from "../controllers/warden.controller.js";


const router = Router();

router.route("/register").post(registerWarden)
router.route("/verifyMail").patch(verifyWardenOtp)


export default router
