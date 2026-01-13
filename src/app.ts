import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./v1/middlewares/error.middleware";
import apiRoute from "@/routes/api.route";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.APP_URL,
  "http://localhost:9000",
  "http://192.168.0.141:9000",
].filter(Boolean); // remove undefined

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow mobile apps or curl

      // Normalize origin (remove trailing slash)
      const cleanOrigin = origin.replace(/\/$/, "");

      if (
        allowedOrigins.some(
          (allowed) => allowed && allowed.replace(/\/$/, "") === cleanOrigin
        )
      ) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoute);

// Catch 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(errorHandler);

export default app;
