import { HttpError } from "@/helpers/error.helper";
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
        const target = err.meta?.target as string[] | undefined;

        // Filter out hotel_id and get the actual business field(s)
        const businessFields = target?.filter(field => field !== 'hotel_id') || [];

        // Get the last business field
        const field = businessFields[businessFields.length - 1] || "field";

        // Create a user-friendly message
        let message: string;

        if (businessFields.length > 1) {
          // Multiple fields - create combined message
          const fieldNames = businessFields
            .map(f => {
              const field = f.replace(/id/g, ' ')
              return field.split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            })
            .join(' and ');

          message = `This combination of ${fieldNames} already exists`;
        } else {
          // Single field
          const fieldName = field
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          message = `${fieldName} already exists`;
        }

        return res.status(409).json({
          errors: [
            {
              code: "DUPLICATE_ENTRY",
              path: [field],
              message: message
            }
          ]
        });

      case "P2003":
        const foreignKeyField = (err.meta?.field_name as string) || "field";

        if (err.meta?.modelName) {
          return res.status(400).json({
            errors: [
              {
                code: "FOREIGN_KEY_CONSTRAINT",
                path: [foreignKeyField],
                message: `${err.meta?.constraint} id not found`
              }
            ]
          });
        }

        return res.status(409).json({
          errors: [
            {
              code: "FOREIGN_KEY_CONSTRAINT",
              path: [foreignKeyField],
              message: "Cannot delete: record in use"
            }
          ]
        });

      case "P2025":
        // Record not found
        return res.status(404).json({
          errors: [
            {
              code: "NOT_FOUND",
              path: [],
              message: "Record not found"
            }
          ]
        });
    }
  } else if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      errors: [
        {
          code: "HTTP_ERROR",
          path: [],
          message: err.message
        }
      ]
    });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    errors: [
      {
        code: "INTERNAL_SERVER_ERROR",
        path: [],
        message: "Internal Server Error"
      }
    ]
  });
}