import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION, COOKIE_MAX_AGE } from "@/constants";
import { User } from "@prisma/client";
import type { Response } from "express";
import { UnauthorizedError } from "./error.helper";
import { TokenPayload } from "@/interfaces";

export class TokenHelper {
    /**
     * Generates Access Token
     * @param user
     * @returns access token string
     */
    generateAccessToken = (id: number, email: string): string => {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("jwt secret is not defined in environment variables");
        }

        return jwt.sign({ id: id, email: email }, jwtSecret, {
            expiresIn: ACCESS_TOKEN_EXPIRATION,
        });
    };

    /**
     * Generates Refresh Token
     * @param user
     * @returns refresh token string
     */
    generateRefreshToken = (user: User): string => {
        const jwtRefreshSecret = process.env.JWT_SECRET;

        if (!jwtRefreshSecret) {
            throw new Error("jwt refresh secret is not defined in environment variables");
        }

        return jwt.sign({ id: user.id, email: user.email }, jwtRefreshSecret, {
            expiresIn: REFRESH_TOKEN_EXPIRATION,
        });
    };

    /**
     * Generates both Access and refresh Token
     * @param user
     * @returns access and refresh token
     */
    generateTokens = (user: User): { accessToken: string; refreshToken: string } => {
        const accessToken = this.generateAccessToken(user.id, user.email);
        const refreshToken = this.generateRefreshToken(user);

        return { accessToken, refreshToken };
    };

    /**
     * Sets the response cookie via HTTP only
     * @param res
     * @param refreshToken
     */
    setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // Prevent JS access
            secure: isProduction, // Use HTTPS in production
            sameSite: "strict", // Prevent CSRF
            maxAge: COOKIE_MAX_AGE, // 7 days in ms
            path: "/", // Optional: limit cookie path
        });
    };

    /**
     * Verify and decode a access token.
     * Throws UnauthorizedError if invalid or expired.
     * @param accessToken
     */
    verifyAccessToken = (accessToken: string): TokenPayload => {
        try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("jwt secret is not defined in environment variables");
            }

            const payload = jwt.verify(accessToken, jwtSecret) as TokenPayload;
            return payload;
        } catch (error) {
            throw new UnauthorizedError("Invalid or expired access token");
        }
    };

    /**
     * Verify and decode a refresh token.
     * Throws UnauthorizedError if invalid or expired.
     * @param refreshToken
     */
    verifyRefreshToken = (refreshToken: string): TokenPayload => {
        try {
            const jwtRefreshSecret = process.env.JWT_SECRET;

            if (!jwtRefreshSecret) {
                throw new Error("jwt refresh secret is not defined in environment variables");
            }

            const payload = jwt.verify(refreshToken, jwtRefreshSecret) as TokenPayload;
            return payload;
        } catch (error) {
            throw new UnauthorizedError("Invalid or expired refresh token");
        }
    };

    /**
     * Clear user http only cookie
     * @param res
     */
    clearUserCookie = (res: Response): void => {
        res.clearCookie("token", { path: "/", httpOnly: true, sameSite: "strict" });
    };
}
