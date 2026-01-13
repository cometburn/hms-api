import prisma from "@/helpers/prisma.helper";
import { CreateGoogleUserInput } from "@/interfaces";
import {
  ActiveSubscriptionResponse,
  UserHotelResponse,
} from "@/interfaces/types/user";
import { User } from "@prisma/client";

/**
 * Updates the user's refresh token in the database.
 *
 * @param userId - The ID of the user
 * @param refreshToken - The new refresh token to store
 * @returns The updated user record
 */
export const updateUserRefreshToken = async (
  userId: number,
  refreshToken: string
): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { refresh_token: refreshToken },
  });
};

/**
 * Get the user via id
 * @param id
 * @returns the found user or null
 */
export const getUserById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      user_type: true,
    },
  });
};

/**
 * Get the user via email
 * @param email
 * @returns the found user or null
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      user_type: true,
    },
  });
};

/**
 * Get user by id and refresh_token
 * @param userId
 * @param refreshToken
 * @returns user or null
 */
export const getUserByIdAndRefreshToken = async (
  userId: number,
  refreshToken: string
): Promise<User | null> => {
  return await prisma.user.findFirst({
    where: { id: userId, refresh_token: refreshToken },
  });
};

/**
 * Gets all of users linked hotels
 * @param userId
 * @returns list of user hotels
 */
export const getUserHotels = async (
  userId: number
): Promise<UserHotelResponse[]> => {
  const userHotels = await prisma.userHotel.findMany({
    where: { user_id: userId },
    orderBy: { id: "asc" },
    include: {
      hotel: {
        select: {
          id: true,
          name: true,
          address: true,
        },
      },
    },
  });

  return userHotels.map((uh) => ({
    ...uh.hotel,
    is_default: uh.is_default,
  }));
};

/**
 * Get User by Id
 * @param id
 * @returns user with default hotel
 */
export const getUserByIdWithDefaultHotel = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      user_type_id: true,
      hotels: {
        where: { is_default: true },
        select: {
          is_default: true,
          hotel: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const defaultHotel = user.hotels.find((h) => h.is_default)?.hotel ?? null;

  return {
    ...user,
    default_hotel: defaultHotel,
  };
};

/**
 * Gets Users Active Subscription
 * @param userId
 * @returns
 */
export const getUserActiveSubscription = async (
  userId: number
): Promise<ActiveSubscriptionResponse | null> => {
  return await prisma.subscription.findFirst({
    where: { user_id: userId, status: "active" },
    select: {
      plan: true,
      status: true,
      starts_at: true,
      ends_at: true,
      trial_ends_at: true,
    },
  });
};

/**
 * Creates user and default subscription
 * @param data
 * @returns user
 */
export const createGoogleUserWithTrial = async (
  data: CreateGoogleUserInput
) => {
  return await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        google_id: data.googleId,
        avatar: data.avatar,
        status: "active",
        user_type_id: 2,
      },
    });

    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await tx.subscription.create({
      data: {
        user_id: newUser.id,
        plan: "trial",
        status: "active",
        trial_ends_at: thirtyDays,
        renewal_period: "monthly",
      },
    });

    return newUser;
  });
};
