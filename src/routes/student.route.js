import { Router } from "express";
import { registerStudent, verifyStudentOtp } from "../controllers/student.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createComplaint } from "../controllers/complaint.controller.js";

const router = Router();

router.route('/register').post(registerStudent);
router.route('/verifyMail').patch(verifyStudentOtp);
router.route("/addComplaint").post(
    upload.single('photo'),
    createComplaint
);

export default router
