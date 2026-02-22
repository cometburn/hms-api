import { NextFunction, Request, Response } from "express";
import {
  createRoomRateService,
  getAllRoomRatesService,
  updateRoomRateService,
  deleteRoomRateService,
  getRoomRatesByRoomTypeIdService
} from "@/services/roomRate.service";
import { NotFoundError } from "@/helpers/error.helper";

/**
 * Gets all room rates using the user default hotel
 * @param req
 * @param res
 */
export const getAllRoomRates = async (req: Request, res: Response) => {
  const user = req.user!;
  if (!user.default_hotel) throw new NotFoundError("User hotel missing");

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = (req.query.search as string) || "";

  // Call service
  const result = await getAllRoomRatesService({
    hotelId: user.default_hotel.id,
    page,
    limit,
    search,
  });

  return res.json(result);
};

/**
 * Creates a room rate using user default hotel
 * @param req
 * @param res
 */
export const createRoomRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const data = req.body;

    if (!user.default_hotel) throw new NotFoundError("User hotel missing");

    const result = await createRoomRateService(user.default_hotel.id, data);

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates room rate
 * @param req
 * @param res
 * @returns
 */
export const updateRoomRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const data = req.body;
    const { id } = req.params;

    if (!user.default_hotel) {
      throw new NotFoundError("User hotel missing");
    }

    console.log('data', data)

    const result = await updateRoomRateService(
      user.default_hotel.id,
      Number(id),
      data
    );

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes room rate
 * @param req
 * @param res
 */
export const deleteRoomRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    if (!user.default_hotel) {
      throw new NotFoundError("User hotel missing");
    }

    await deleteRoomRateService(user.default_hotel.id, Number(id));

    return res.status(200).json({
      message: "Room rate deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Gets room rates by room type id
 * @param req
 * @param res
 */
export const getRoomRatesByRoomTypeId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const { roomTypeId } = req.params;

    if (!user.default_hotel) {
      throw new NotFoundError("User hotel missing");
    }

    const result = await getRoomRatesByRoomTypeIdService(
      user.default_hotel.id,
      Number(roomTypeId)
    );

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}