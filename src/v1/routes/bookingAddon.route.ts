import { Router } from "express";
import { BookingAddonController } from "@/controllers/bookingAddon.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { bookingAddonSchema } from "@/interfaces/types/bookingAddon.types";

const router = Router();
const controller = new BookingAddonController();

router.get("/:bookingId", controller.getBookingAddons);
router.post("/", withValidation(bookingAddonSchema, controller.createBookingAddon));
router.delete("/:bookingId", controller.deleteBookingAddon);

export default router;
