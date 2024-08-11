import { Router } from "express";
import { loginStudent, logoutStudent, registerStudent, verifyStudentOtp } from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerStudent);
router.route('/verifyMail').patch(verifyStudentOtp);
router.route('/login').post(loginStudent);
router.route('/logout').post(verifyJWT,logoutStudent);

export default router
