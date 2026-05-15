import { Router } from "express";
import * as authController from "@/Controllers/authController.js";
import { validate } from "@/Middleware/validate.js";
import { authenticate } from "@/Middleware/auth.js";
import { LoginSchema, SignupSchema } from "@/Types/validation.js";

const router = Router();

/**
 * @route POST /auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post("/signup", validate(SignupSchema), authController.signup);

/**
 * @route POST /auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", validate(LoginSchema), authController.login);

/**
 * @route POST /auth/logout
 * @desc Logout the current user
 * @access Private
 */
router.post("/logout", authController.logout);

/**
 * @route GET /auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get("/profile", authenticate, authController.getCurrentUser);

export default router;
