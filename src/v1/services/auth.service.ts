import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { UnauthorizedError } from "@/helpers/error.helper";
import { generateTokens, generateAccessToken, verifyRefreshToken } from "@/helpers/token.helper";
import { ActiveSubscriptionResponse, UserHotelResponse } from "@/interfaces/types/user.types";
import { verifyGoogleToken } from "@/helpers/google.helper";
import * as UserRepository from "@/repositories/user.repository";

/**
 * Login Service handler
 * @param email
 * @param password
 * @returns user, access token, refresh token, user hotels and subscription
 */
export const login = async (email: string, password: string) => {
    const user = await UserRepository.getUserByEmail(email);

    if (!user || !user.password) throw new UnauthorizedError("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError("Invalid credentials");

    const { accessToken, refreshToken } = generateTokens(user);

    UserRepository.updateUserRefreshToken(user.id, refreshToken);
    const userHotels = await UserRepository.getUserHotels(user.id);
    const subscription = await UserRepository.getUserActiveSubscription(user.id);

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
export const refreshToken = async (refreshToken: string): Promise<string> => {
    try {
        const payload = verifyRefreshToken(refreshToken);

        const user = await UserRepository.getUserByIdAndRefreshToken(
            Number(payload.id),
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
export const me = async (
    id: number
): Promise<{
    user: User;
    userHotels: UserHotelResponse[];
    subscription: ActiveSubscriptionResponse | null;
}> => {
    const user = await UserRepository.getUserById(id);
    if (!user) throw new UnauthorizedError("User not found");

    let userHotels: UserHotelResponse[];
    userHotels = await UserRepository.getUserHotels(user.id);
    const subscription = await UserRepository.getUserActiveSubscription(user.id);

    return {
        user,
        userHotels,
        subscription,
    };
};

/**
 * Google Login  which creates a user with trial period
 * @param googleToken
 * @returns user, access token, refresh token, user hotels and subscription
 */
export const googleLogin = async (googleToken: string) => {
    if (!googleToken) throw new UnauthorizedError("Missing Google token");

    const payload = await verifyGoogleToken(googleToken);
    if (!payload) throw new UnauthorizedError("Invalid Google token");

    const { email, name, picture, sub } = payload;
    if (!email) throw new UnauthorizedError("Email not found in Google payload");

    // Find or create user
    let user = await UserRepository.getUserByEmail(email);

    if (!user) {
        const fullName = name ?? "";
        const [firstName, ...lastNameParts] = fullName.split(" ");
        const lastName = lastNameParts.join(" ");

        user = await UserRepository.createGoogleUserWithTrial({
            email,
            firstName,
            lastName,
            googleId: sub,
            avatar: picture ?? "",
        });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    await UserRepository.updateUserRefreshToken(user.id, refreshToken);
    const userHotels = await UserRepository.getUserHotels(user.id);
    const subscription = await UserRepository.getUserActiveSubscription(user.id);

    return {
        accessToken,
        refreshToken,
        user,
        userHotels,
        subscription,
    };
};