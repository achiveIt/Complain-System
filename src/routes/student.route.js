import { Router } from "express";
import { changePassword, loginStudent, logoutStudent, passwordReset, passwordResetRequest, regenerateOtp, registerStudent, updatePhoneNo, verifyStudentOtp } from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerStudent);
router.route('/verifyMail').patch(verifyStudentOtp);
router.route('/regenerateOtp').patch(regenerateOtp);

router.route('/login').post(loginStudent);
router.route('/logout').post(verifyJWT,logoutStudent);

router.route('/changePassword').patch(verifyJWT,changePassword);

router.route('/updatePhoneNumber').patch(verifyJWT,updatePhoneNo);

router.route('/passwordResetRequest').post(verifyJWT,passwordResetRequest);
router.route('/resetPassword').patch(verifyJWT,passwordReset);


export default router
