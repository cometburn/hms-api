import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

export function withValidation<T extends z.ZodTypeAny>(
  schema: T,
  handler: (
    req: Request & { body: z.infer<T> },
    res: Response,
    next: NextFunction
  ) => any
): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    req.body = result.data;
    return handler(req as Request & { body: z.infer<T> }, res, next);
  };
}
