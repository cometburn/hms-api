import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { verifyAccessToken, verifyRefreshToken } from '@/helpers/token.helper';

export const configureSocket = (io: Server) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            const refreshToken = socket.handshake.headers.cookie
                ?.split('; ')
                .find(row => row.startsWith('refreshToken='))
                ?.split('=')[1];

            if (!token) {
                return next(new Error("Authentication token required"));
            }

            let decoded;
            try {
                // Try to verify the access token first
                decoded = verifyAccessToken(token);
            } catch (err) {
                try {
                    decoded = refreshToken ? verifyRefreshToken(refreshToken) : null;
                } catch (err) {
                    return next(new Error("Invalid or expired refresh token"));
                }
            }

            if (!decoded) {
                return next(new Error("Invalid or expired refresh token"));
            }

            // Attach user info to socket for later use
            socket.data.userId = decoded.id;
            socket.data.userEmail = decoded.email;
            socket.data.user = decoded; // Store full decoded token

            console.log(`🚀 Socket authenticated for user: ${socket.data.userId}`);
            next();
        } catch (error) {

            console.error("Socket authentication error:", error);

            if (error instanceof jwt.TokenExpiredError) {
                return next(new Error("Token expired"));
            }
            if (error instanceof jwt.JsonWebTokenError) {
                return next(new Error("Invalid token"));
            }

            next(new Error("Authentication failed"));
        }
    });

    return io;
};