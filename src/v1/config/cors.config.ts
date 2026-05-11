import { CorsOptions } from "cors";

export const allowedOrigins = [
    process.env.APP_URL,
    "http://localhost:9000",
    "http://localhost:9001",
    "http://192.168.0.141:9000",
    "https://cler-app-one.vercel.app/"
].filter((origin): origin is string => !!origin);

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Normalize origin (remove trailing slash)
        const cleanOrigin = origin.replace(/\/$/, "");

        if (
            allowedOrigins.some((allowed) => allowed && allowed.replace(/\/$/, "") === cleanOrigin)
        ) {
            callback(null, true);
        } else {
            console.warn(`🚫 CORS blocked request from ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

export const socketCorsOptions = {
    origin: allowedOrigins,
    credentials: true,
};
