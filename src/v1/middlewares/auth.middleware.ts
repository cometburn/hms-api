import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@/helpers/error.helper";
import { TokenHelper } from "@/helpers/token.helper";
import { UserRepository } from "@/repositories/user.repository";

/**
 * Middleware to protect routes.
 * Checks for a valid access token, falls back to refresh token if expired.
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenHelper = new TokenHelper();
        const userRepository = new UserRepository();

        const bearer = req.headers.authorization;

        if (!bearer?.startsWith("Bearer ")) {
            throw new UnauthorizedError("No token provided");
        }

        const [, accessToken] = bearer.split(" ");

        let payload;

        try {
            // Try to verify the access token first
            payload = tokenHelper.verifyAccessToken(accessToken);
        } catch (err) {
            // If access token expired, check refresh token
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) throw new UnauthorizedError("Session expired");

            try {
                const refreshPayload = tokenHelper.verifyRefreshToken(refreshToken);
                const user = await userRepository.getUserByIdWithDefaultHotel(
                    Number(refreshPayload.id)
                );
                if (!user) throw new UnauthorizedError("Invalid refresh token");

                // 🔹 Generate a new access token and set it in response header
                const newAccessToken = tokenHelper.generateAccessToken(user.id, user.email);
                res.setHeader("x-access-token", newAccessToken);

                // Optional: refresh cookie if near expiration
                tokenHelper.setRefreshTokenCookie(res, refreshToken);

                req.user = user;
                return next();
            } catch {
                throw new UnauthorizedError("Invalid or expired refresh token");
            }
        }

        // If access token is valid, get user
        const user = await userRepository.getUserByIdWithDefaultHotel(Number(payload.id));
        if (!user) throw new UnauthorizedError("Invalid user");

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
