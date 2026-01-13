import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  COOKIE_MAX_AGE,
} from "@/constants";
import { User } from "@prisma/client";
import type { Response } from "express";
import { UnauthorizedError } from "./error.helper";
import { TokenPayload } from "@/interfaces";

/**
 * Generates Access Token
 * @param user
 * @returns access token string
 */
export const generateAccessToken = (id: number, email: string): string => {
  return jwt.sign({ sub: id, email: email }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
};

/**
 * Generates Refresh Token
 * @param user
 * @returns refresh token string
 */
export const generateRefreshToken = (user: User): string => {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

/**
 * Generates both Access and refresh Token
 * @param user
 * @returns access and refresh token
 */
export const generateTokens = (
  user: User
): { accessToken: string; refreshToken: string } => {
  const accessToken = generateAccessToken(user.id, user.email);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
};

/**
 * Sets the response cookie via HTTP only
 * @param res
 * @param refreshToken
 */
export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string
): void => {
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
export const verifyAccessToken = (accessToken: string): TokenPayload => {
  try {
    const payload = jwt.verify(accessToken, JWT_SECRET) as TokenPayload;
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
export const verifyRefreshToken = (refreshToken: string): TokenPayload => {
  try {
    const payload = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as TokenPayload;
    return payload;
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
};

/**
 * Clear user http only cookie
 * @param res
 */
export const clearUserCookie = (res: Response): void => {
  res.clearCookie("token", { path: "/", httpOnly: true, sameSite: "strict" });
};
