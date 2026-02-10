import { NextFunction, Request, Response } from "express";
import {
  createRoomTypeService,
  getAllRoomTypesService,
  updateRoomTypeService,
  deleteRoomTypeService,
} from "@/services/roomType.service";
import { NotFoundError } from "@/helpers/error.helper";

/**
 * Gets all room types using the user default hotel
 * @param req
 * @param res
 */
export const getAllRoomTypes = async (req: Request, res: Response) => {
  const user = req.user!;
  if (!user.default_hotel) throw new NotFoundError("User hotel missing");

  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const search = (req.query.search as string) || "";

  // Allow 0 to pass through; default only if missing or invalid
  const safePage = !isNaN(page) ? page : 1;
  const safeLimit = !isNaN(limit) ? limit : 10;

  const result = await getAllRoomTypesService({
    hotelId: user.default_hotel.id,
    page: safePage,
    limit: safeLimit,
    search,
  });

  return res.json(result);
};

/**
 * Creates a room type using user default hotel
 * @param req
 * @param res
 */
export const createRoomType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const data = req.body;

    if (!user.default_hotel) throw new NotFoundError("User hotel missing");

    const result = await createRoomTypeService(user.default_hotel.id, data);

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
export const updateRoomType = async (
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

    const result = await updateRoomTypeService(
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
 * Deletes room type
 * @param req
 * @param res
 */
export const deleteRoomType = async (
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

    await deleteRoomTypeService(user.default_hotel.id, Number(id));

    return res.status(200).json({
      message: "Room type deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
