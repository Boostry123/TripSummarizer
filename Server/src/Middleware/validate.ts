import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";

/**
 * Middleware to validate request body against a Zod schema.
 * Sends a 400 Bad Request if validation fails.
 */
export const validate =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Reassigning to req.body ensures that the validated (and possibly transformed)
      // data is what's used in subsequent middleware/controllers.
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }

      console.error("Validation middleware unexpected error:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  };
