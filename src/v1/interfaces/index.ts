import { Subscription, User, UserHotel } from "@prisma/client";
import { UserHotelResponse } from "./types/user";

export interface SanitizedUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type_id: number;
  // All hotels linked to the user
  hotels: {
    is_default: boolean;
    hotel: {
      id: number;
      name: string;
      address: string;
    };
  }[];

  // Convenience property: extracted default hotel (optional)
  default_hotel?: {
    id: number;
    name: string;
    address: string;
  } | null;
}

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  userHotels: UserHotelResponse[];
  subscription: Subscription | null;
}

export interface CreateGoogleUserInput {
  email: string;
  firstName: string;
  lastName: string;
  googleId: string;
  avatar: string;
}

/**
 * Start Room Types
 */
export interface GetAllRoomTypesParams {
  hotelId: number;
  page: number;
  limit: number;
  search: string;
}

/**
 * End Room Types
 */
