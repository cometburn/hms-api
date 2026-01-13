import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        // Unique constraint failed
        return res.status(409).json({ message: "Duplicate record" });

      case "P2003":
        // Foreign key constraint failed
        return res.status(409).json({
          message: "Cannot delete: record in use",
        });

      case "P2025":
        // Record not found
        return res.status(404).json({ message: "Record not found" });
    }
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
}
