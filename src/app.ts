import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { createServer } from "node:http";
import { Server } from 'socket.io';

// Configurations
import { configureMiddleware } from "@/config/middleware.config";
import { socketCorsOptions } from "@/config/cors.config";
import { configureSocket } from "@/config/socket.config";

// Middleware
import { errorHandler } from "./v1/middlewares/error.middleware";

// Routes
import apiRoute from "@/routes/api.route";

// Socket handlers
import { registerSocketHandlers } from "@/sockets/socket.handler";
import { socketService } from "@/sockets/socket.service";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Create HTTP server
export const httpServer = createServer(app);

// Initialize Socket.IO with CORS
export const io = new Server(httpServer, {
  cors: socketCorsOptions,
});

// Configure middleware (CORS, body parsing, etc.)
configureMiddleware(app);

// Configure Socket.IO authentication
configureSocket(io);

// Initialize socket service
socketService.init(io);

// Register socket event handlers
registerSocketHandlers(io);

// Block directory listing
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "API is running. Use /api endpoints.",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api", apiRoute);

// Catch 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: "Not Found",
    message: "Route not found",
    path: req.path
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;