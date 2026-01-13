import { NextFunction, Request, Response } from "express";
import {
  createRoomPromoService,
  getAllRoomPromosService,
  updateRoomPromoService,
  deleteRoomPromoService,
} from "@/services/roomPromo.service";
import { NotFoundError } from "@/helpers/error.helper";

/**
 * Gets all room Promos using the user default hotel
 * @param req
 * @param res
 */
export const getAllRoomPromos = async (req: Request, res: Response) => {
  const user = req.user!;
  if (!user.default_hotel) throw new NotFoundError("User hotel missing");

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = (req.query.search as string) || "";

  // Call service
  const result = await getAllRoomPromosService({
    hotelId: user.default_hotel.id,
    page,
    limit,
    search,
  });

  return res.json(result);
};

/**
 * Creates a room Promo using user default hotel
 * @param req
 * @param res
 */
export const createRoomPromo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const data = req.body;

    if (!user.default_hotel) throw new NotFoundError("User hotel missing");

    const result = await createRoomPromoService(user.default_hotel.id, data);

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const updateRoomPromo = async (
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

    const result = await updateRoomPromoService(
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
 * Deletes room Promo
 * @param req
 * @param res
 */
export const deleteRoomPromo = async (
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

    await deleteRoomPromoService(user.default_hotel.id, Number(id));

    return res.status(200).json({
      message: "Room Promo deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
