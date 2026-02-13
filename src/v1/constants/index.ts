export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const ACCESS_TOKEN_EXPIRATION = "1s";
export const REFRESH_TOKEN_EXPIRATION = "7d";
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const ROOM_STATUS = ["available", "occupied", "maintenance"];
export const OPERATIONAL_STATUS = ["available", "maintenance", "out of service"];
