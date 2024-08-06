import { Router } from "express";
import { registerStudent, verifyStudentOtp } from "../controllers/student.controller.js";
const router= Router();

router.route("register").post(registerStudent);
router.route("verifyMail").patch(verifyStudentOtp);

export default router
