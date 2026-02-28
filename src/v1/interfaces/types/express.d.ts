import type { SanitizedUser } from ".."; // your own user type

declare global {
    namespace Express {
        interface Request {
            user?: SanitizedUser;
        }
    }
}
