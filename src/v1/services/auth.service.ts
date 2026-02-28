import bcrypt from "bcrypt";
import { UnauthorizedError } from "@/helpers/error.helper";
import { UserRepository } from "@/repositories/user.repository";
import { TokenHelper } from "@/helpers/token.helper";
import { User } from "@prisma/client";
import { ActiveSubscriptionResponse, UserHotelResponse } from "@/interfaces/types/user.types";
import { GoogleHelper } from "@/helpers/google.helper";

export class AuthService {
    private tokenHelper: TokenHelper;
    private googleHelper: GoogleHelper;
    private userRepo: UserRepository;
    constructor() {
        this.tokenHelper = new TokenHelper();
        this.googleHelper = new GoogleHelper();
        this.userRepo = new UserRepository();
    }
    /**
     * Login Service handler
     * @param email
     * @param password
     * @returns user, access token, refresh token, user hotels and subscription
     */
    login = async (email: string, password: string) => {
        const user = await this.userRepo.getUserByEmail(email);

        if (!user || !user.password) throw new UnauthorizedError("Invalid credentials");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedError("Invalid credentials");

        const { accessToken, refreshToken } = this.tokenHelper.generateTokens(user);

        this.userRepo.updateUserRefreshToken(user.id, refreshToken);
        const userHotels = await this.userRepo.getUserHotels(user.id);
        const subscription = await this.userRepo.getUserActiveSubscription(user.id);

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
    refreshToken = async (refreshToken: string): Promise<string> => {
        try {
            const payload = this.tokenHelper.verifyRefreshToken(refreshToken);

            const user = await this.userRepo.getUserByIdAndRefreshToken(
                Number(payload.id),
                refreshToken
            );

            if (!user || user.refresh_token !== refreshToken)
                throw new UnauthorizedError("Invalid refresh token");

            const newAccessToken = this.tokenHelper.generateAccessToken(user.id, user.email);

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
    me = async (
        id: number
    ): Promise<{
        user: User;
        userHotels: UserHotelResponse[];
        subscription: ActiveSubscriptionResponse | null;
    }> => {
        const user = await this.userRepo.getUserById(id);
        if (!user) throw new UnauthorizedError("User not found");

        let userHotels: UserHotelResponse[];
        userHotels = await this.userRepo.getUserHotels(user.id);
        const subscription = await this.userRepo.getUserActiveSubscription(user.id);

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
    googleLogin = async (googleToken: string) => {
        if (!googleToken) throw new UnauthorizedError("Missing Google token");

        const payload = await this.googleHelper.verifyGoogleToken(googleToken);
        if (!payload) throw new UnauthorizedError("Invalid Google token");

        const { email, name, picture, sub } = payload;
        if (!email) throw new UnauthorizedError("Email not found in Google payload");

        // Find or create user
        let user = await this.userRepo.getUserByEmail(email);

        if (!user) {
            const fullName = name ?? "";
            const [firstName, ...lastNameParts] = fullName.split(" ");
            const lastName = lastNameParts.join(" ");

            user = await this.userRepo.createGoogleUserWithTrial({
                email,
                firstName,
                lastName,
                googleId: sub,
                avatar: picture ?? "",
            });
        }

        const { accessToken, refreshToken } = this.tokenHelper.generateTokens(user);
        await this.userRepo.updateUserRefreshToken(user.id, refreshToken);
        const userHotels = await this.userRepo.getUserHotels(user.id);
        const subscription = await this.userRepo.getUserActiveSubscription(user.id);

        return {
            accessToken,
            refreshToken,
            user,
            userHotels,
            subscription,
        };
    };
}
