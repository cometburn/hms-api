import express from "express";
import { getBookingAddons, createBookingAddon, deleteBookingAddon } from "@/controllers/bookingAddon.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { bookingAddonSchema } from "@/interfaces/types/bookingAddon.types";

const bookingAddonRoute = express.Router();

bookingAddonRoute.get("/:bookingId", getBookingAddons);
bookingAddonRoute.post("/", withValidation(bookingAddonSchema, createBookingAddon));
bookingAddonRoute.delete("/:bookingId", deleteBookingAddon);

export default bookingAddonRoute;
