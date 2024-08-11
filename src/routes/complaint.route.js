import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createComplaint } from "../controllers/complaint.controller.js";

const router = Router()

router.route("/complaint").post(
    upload.array('photo',3),
    createComplaint
)

export default router