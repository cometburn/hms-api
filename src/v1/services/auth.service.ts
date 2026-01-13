import { UnauthorizedError } from "@/helpers/error.helper";
import bcrypt from "bcrypt";

import {
  createGoogleUserWithTrial,
  getUserActiveSubscription,
  getUserByEmail,
  getUserById,
  getUserByIdAndRefreshToken,
  getUserHotels,
  updateUserRefreshToken,
} from "@/repositories/user.repository";
import {
  generateAccessToken,
  generateTokens,
  verifyRefreshToken,
} from "@/helpers/token.helper";
import { Subscription, User, UserHotel } from "@prisma/client";
import {
  ActiveSubscriptionResponse,
  UserHotelResponse,
} from "@/interfaces/types/user";
import { verifyGoogleToken } from "@/helpers/google.helper";

/**
 * Login Service handler
 * @param email
 * @param password
 * @returns user, access token, refresh token, user hotels and subscription
 */
export const loginService = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user || !user.password)
    throw new UnauthorizedError("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new UnauthorizedError("Invalid credentials");

  const { accessToken, refreshToken } = generateTokens(user);

  updateUserRefreshToken(user.id, refreshToken);
  const userHotels = await getUserHotels(user.id);
  const subscription = await getUserActiveSubscription(user.id);

  return {
    user,
    accessToken,
    refreshToken,
    userHotels,
    subscription,
  };
};

/**
 * Verify Refresh token
 * @param refreshToken
 * @returns new access token
 */
export const refreshTokenService = async (
  refreshToken: string
): Promise<string> => {
  try {
    const payload = verifyRefreshToken(refreshToken);

    const user = await getUserByIdAndRefreshToken(
      Number(payload.sub),
      refreshToken
    );

    if (!user || user.refresh_token !== refreshToken)
      throw new UnauthorizedError("Invalid refresh token");

    const newAccessToken = generateAccessToken(user.id, user.email);

    return newAccessToken;
  } catch (err) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
};

/**
 * Gets user details on page refresh
 * @param id
 * @returns user, user hotels and subscription
 */
export const meService = async (
  id: number
): Promise<{
  user: User;
  userHotels: UserHotelResponse[];
  subscription: ActiveSubscriptionResponse | null;
}> => {
  const user = await getUserById(id);
  if (!user) throw new UnauthorizedError("User not found");

  let userHotels: UserHotelResponse[];
  userHotels = await getUserHotels(user.id);
  const subscription = await getUserActiveSubscription(user.id);

  return {
    user,
    userHotels,
    subscription,
  };
};

/**
 * Google Login Service which creates a user with trial period
 * @param googleToken
 * @returns user, access token, refresh token, user hotels and subscription
 */
export const googleLoginService = async (googleToken: string) => {
  if (!googleToken) throw new UnauthorizedError("Missing Google token");

  const payload = await verifyGoogleToken(googleToken);
  if (!payload) throw new UnauthorizedError("Invalid Google token");

  const { email, name, picture, sub } = payload;
  if (!email) throw new UnauthorizedError("Email not found in Google payload");

  // Find or create user
  let user = await getUserByEmail(email);

  if (!user) {
    const fullName = name ?? "";
    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    user = await createGoogleUserWithTrial({
      email,
      firstName,
      lastName,
      googleId: sub,
      avatar: picture ?? "",
    });
  }

  const { accessToken, refreshToken } = generateTokens(user);
  updateUserRefreshToken(user.id, refreshToken);
  const userHotels = await getUserHotels(user.id);
  const subscription = await getUserActiveSubscription(user.id);

  return {
    accessToken,
    refreshToken,
    user,
    userHotels,
    subscription,
  };
};
