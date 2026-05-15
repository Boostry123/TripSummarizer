import { Request, Response } from "express";
import * as authService from "@/Service/authService.js";
import { LoginCredentials, RegisterCredentials } from "@/Types/auth.js";
import { AuthRequest } from "@/Middleware/auth.js";

/**
 * Auth Controller
 * Handles user registration and login by delegating to AuthService
 */
export const signup = async (
  req: Request<{}, {}, RegisterCredentials>,
  res: Response,
) => {
  try {
    const result = await authService.signup(req.body);

    if (result.error) {
      return res
        .status(result.error.status)
        .json({ error: result.error.message });
    }

    res.status(201).json({
      message: "Signup successful",
      user: result.user,
      token: result.token,
    });
  } catch (error: unknown) {
    console.error("Signup controller error:", error);
    res.status(500).json({ error: "Internal server error during signup" });
  }
};

export const login = async (
  req: Request<{}, {}, LoginCredentials>,
  res: Response,
) => {
  try {
    const result = await authService.login(req.body);

    if (result.error) {
      return res
        .status(result.error.status)
        .json({ error: result.error.message });
    }

    res.status(200).json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error: unknown) {
    console.error("Login controller error:", error);
    res.status(500).json({ error: "Internal server error during login" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const result = await authService.logout();

    if (result.error) {
      return res
        .status(result.error.status)
        .json({ error: result.error.message });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: unknown) {
    console.error("Logout controller error:", error);
    res.status(500).json({ error: "Internal server error during logout" });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const result = await authService.getCurrentUser(req.token, req.user.id);

    if (result.error) {
      return res
        .status(result.error.status)
        .json({ error: result.error.message });
    }

    res.status(200).json({
      user: result.user,
    });
  } catch (error: unknown) {
    console.error("GetCurrentUser controller error:", error);
    res
      .status(500)
      .json({ error: "Internal server error during profile fetch" });
  }
};
