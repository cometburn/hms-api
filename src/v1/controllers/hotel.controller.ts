import { Request, Response } from "express";
import { createHotelService } from "@/services/hotel.service";

/**
 * Create Hotel
 * @param req
 * @param res
 * @returns
 */
export const createHotel = async (req: Request, res: Response) => {
  const user = req.user!;
  const data = req.body;

  const hotel = await createHotelService(user.id, data);

  return res.status(201).json(hotel);
};
