import { Router } from "express";
import { registerWarden } from "../controllers/warden.controller.js";


const router = Router();

router.route("/register").post(registerWarden)

export default router
