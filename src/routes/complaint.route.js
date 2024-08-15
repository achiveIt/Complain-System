import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addComplaintReminder, changeComplaintStatus, createComplaint } from "../controllers/complaint.controller.js";

const router = Router()

router.route("/complaint").post(
    upload.array('photo',3),
    createComplaint
)

router.route('/changeComplaintStatus').patch(changeComplaintStatus)
router.route('/addComplaintReminder').patch(addComplaintReminder)

export default router