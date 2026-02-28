import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleHelper {
    private client: OAuth2Client;
    constructor() {
        this.client = client;
    }

    /**
     * Verifies a Google ID token and returns the payload.
     * @param token The Google ID token to verify.
     * @returns The payload of the verified token or null if verification fails.
     */
    verifyGoogleToken = async (token: string) => {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            return ticket.getPayload();
        } catch {
            return null;
        }
    };
}
