import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@/helpers/error.helper";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  setRefreshTokenCookie,
} from "@/helpers/token.helper";
import { getUserByIdWithDefaultHotel } from "@/repositories/user.repository";

/**
 * Middleware to protect routes.
 * Checks for a valid access token, falls back to refresh token if expired.
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearer = req.headers.authorization;

    if (!bearer?.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const [, accessToken] = bearer.split(" ");

    let payload;

    try {
      // Try to verify the access token first
      payload = verifyAccessToken(accessToken);
    } catch (err) {
      // If access token expired, check refresh token
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) throw new UnauthorizedError("Session expired");

      try {
        const refreshPayload = verifyRefreshToken(refreshToken);
        const user = await getUserByIdWithDefaultHotel(
          Number(refreshPayload.id)
        );
        if (!user) throw new UnauthorizedError("Invalid refresh token");

        // 🔹 Generate a new access token and set it in response header
        const newAccessToken = generateAccessToken(user.id, user.email);
        res.setHeader("x-access-token", newAccessToken);

        // Optional: refresh cookie if near expiration
        setRefreshTokenCookie(res, refreshToken);

        req.user = user;
        return next();
      } catch {
        throw new UnauthorizedError("Invalid or expired refresh token");
      }
    }

    // If access token is valid, get user
    const user = await getUserByIdWithDefaultHotel(Number(payload.id));
    if (!user) throw new UnauthorizedError("Invalid user");

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
