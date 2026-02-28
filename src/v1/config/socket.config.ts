import { Server } from "socket.io";
import { TokenHelper } from "@/helpers/token.helper";
import { UserRepository } from "@/repositories/user.repository";

export const configureSocket = (io: Server): void => {
    io.use(async (socket, next) => {
        try {
            const tokenHelper = new TokenHelper();
            const userRepository = new UserRepository();
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }

            let decoded;

            try {
                // Try to verify access token
                decoded = tokenHelper.verifyAccessToken(token);
            } catch (accessError) {
                let refreshToken = null;

                if (socket.handshake.headers.cookie) {
                    const cookies = socket.handshake.headers.cookie
                        .split(';')
                        .reduce((acc, cookie) => {
                            const [key, value] = cookie.trim().split('=');
                            acc[key] = value;
                            return acc;
                        }, {} as Record<string, string>);

                    refreshToken = cookies.refreshToken;
                }

                if (!refreshToken) {
                    return next(new Error("Authentication error: Token expired and no refresh token"));
                }

                try {
                    const refreshPayload = tokenHelper.verifyRefreshToken(refreshToken);
                    const user = await userRepository.getUserByIdWithDefaultHotel(Number(refreshPayload.id));

                    if (!user) {
                        console.error("❌ User not found");
                        return next(new Error("Authentication error: User not found"));
                    }

                    // Use refresh token payload
                    decoded = refreshPayload;
                } catch (refreshError) {
                    return next(new Error("Authentication error: All tokens expired"));
                }
            }

            socket.data.userId = decoded.id;
            socket.data.userEmail = decoded.email;
            next();
        } catch (error) {
            next(new Error("Authentication error"));
        }
    });
};