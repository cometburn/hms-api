import { OPERATIONAL_STATUS, ROOM_STATUS } from "@/constants";
import { z } from "zod";

export const roomSchema = z.object({
    id: z.number().optional(),
    room_type_id: z.number(),
    name: z.string().min(1, "Name is required"),
    floor: z.string().optional().nullable(),
    operational_status: z.enum(OPERATIONAL_STATUS).optional().nullable(),
    note: z.string().optional().nullable(),
});

export type Room = z.infer<typeof roomSchema>;
