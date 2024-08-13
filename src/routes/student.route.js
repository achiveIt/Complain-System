import { Router } from "express";
import { changePassword, loginStudent, logoutStudent, registerStudent, updatePhoneNo, verifyStudentOtp } from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerStudent);
router.route('/verifyMail').patch(verifyStudentOtp);
router.route('/login').post(loginStudent);
router.route('/logout').post(verifyJWT,logoutStudent);
router.route('/changePassword').patch(verifyJWT,changePassword);
router.route('/updatePhoneNumber').patch(verifyJWT,updatePhoneNo);


export default router
