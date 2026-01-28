// src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
export const validate =
  (schema: z.ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate query, body, and params
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      Object.defineProperty(req, "query", {
        value: validated.query,
        writable: true,
        enumerable: true,
        configurable: true,
      }); // Replace req data with validated/transformed data
      Object.assign(req.query, validated.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          errors: error.issues.map((e) => ({
            path: e.path[1],
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
