import type { Request, Response } from "express";
import { AuthService } from "@/services/auth.service";
import { UnauthorizedError } from "@/helpers/error.helper";
import { TokenHelper } from "@/helpers/token.helper";

export class AuthController {
    private authService: AuthService;
    private tokenHelper: TokenHelper;

    constructor() {
        this.authService = new AuthService();
        this.tokenHelper = new TokenHelper();

        this.login = this.login.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.me = this.me.bind(this);
        this.logout = this.logout.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
    }

    /**
     * Login Handler
     * @param req
     * @param res
     * @returns
     */
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const { user, accessToken, refreshToken, userHotels, subscription } =
            await this.authService.login(email, password);

        this.tokenHelper.setRefreshTokenCookie(res, refreshToken);

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
                default_hotel_id: userHotels.find((h) => h.is_default)?.id ?? null,
            },
        });
    }

    /**
     * Refresh Token Handler
     * @param req
     * @param res
     */
    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new UnauthorizedError("No refresh token provided");

        const newAccessToken = await this.authService.refreshToken(refreshToken);

        res.json({ accessToken: newAccessToken });
    }

    /**
     * Get current user
     * @param req
     * @param res
     */
    async me(req: Request, res: Response) {
        const user = req.user!;

        const { user: foundUser, userHotels, subscription } = await this.authService.me(user.id);

        return res.json({
            id: foundUser.id,
            email: foundUser.email,
            first_name: foundUser.first_name,
            last_name: foundUser.last_name,
            user_type_id: foundUser.user_type_id,
            hotels: userHotels,
            subscription: subscription,
            default_hotel_id: userHotels.find((h) => h.is_default)?.id ?? null,
        });
    }

    /**
     * Logout Handler
     * @param res
     */
    async logout(res: Response) {
        this.tokenHelper.clearUserCookie(res);
        return res.json({ message: "Logout successful" });
    }

    /**
     * Google Login Handler
     * @param req
     * @param res
     * @returns
     */
    async googleLogin(req: Request, res: Response): Promise<Response> {
        const { googleToken } = req.body;

        const { accessToken, refreshToken, user, userHotels, subscription } =
            await this.authService.googleLogin(googleToken);

        // Attach refresh token as httpOnly cookie
        this.tokenHelper.setRefreshTokenCookie(res, refreshToken);

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
                default_hotel_id: userHotels.find((h) => h.is_default)?.id ?? null,
            },
        });
    }
}
