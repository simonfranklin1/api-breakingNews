import { Router } from "express";
const router = Router();
import authController from "../controllers/auth.controller.js";

router.post("/", authController.login)

export default router;