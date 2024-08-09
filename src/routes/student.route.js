import { Router } from "express";
import { loginStudent, registerStudent, verifyStudentOtp } from "../controllers/student.controller.js";

const router = Router();

router.route('/register').post(registerStudent);
router.route('/verifyMail').patch(verifyStudentOtp);
router.route('/login').post(loginStudent);

export default router
