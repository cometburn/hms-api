import type { Request, Response } from "express";
import {
  googleLoginService,
  loginService,
  meService,
  refreshTokenService,
} from "@/services/auth.service";
import { clearUserCookie, setRefreshTokenCookie } from "@/helpers/token.helper";
import { BadRequestError, UnauthorizedError } from "@/helpers/error.helper";

/**
 * Login Handler
 * @param req
 * @param res
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken, userHotels, subscription } =
    await loginService(email, password);

  setRefreshTokenCookie(res, refreshToken);

  return res.json({
    message: "Login successful",
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type_id: user.user_type_id,
      hotels: userHotels,
      subscription: subscription,
    },
  });
};

/**
 * Refresh Token Handler
 * @param req
 * @param res
 */
export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new UnauthorizedError("No refresh token provided");

  const newAccessToken = await refreshTokenService(refreshToken);

  res.json({ accessToken: newAccessToken });
};

/**
 *
 * @param req
 * @param res
 */
export const me = async (req: Request, res: Response) => {
  const user = req.user!;

  const {
    user: foundUser,
    userHotels,
    subscription,
  } = await meService(user.id);

  return res.json({
    id: foundUser.id,
    email: foundUser.email,
    first_name: foundUser.first_name,
    last_name: foundUser.last_name,
    user_type_id: foundUser.user_type_id,
    hotels: userHotels,
    subscription: subscription,
  });
};

export const logout = async (res: Response) => {
  clearUserCookie(res);
  return res.json({ message: "Logout successful" });
};

export const googleLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { googleToken } = req.body;

  const { accessToken, refreshToken, user, userHotels, subscription } =
    await googleLoginService(googleToken);

  // Attach refresh token as httpOnly cookie
  setRefreshTokenCookie(res, refreshToken);

  return res.json({
    message: "Login successful",
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type_id: user.user_type_id,
      hotels: userHotels,
      subscription,
    },
  });
};
