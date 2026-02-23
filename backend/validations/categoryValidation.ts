import {z} from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(3, "name must be at least 3 characters"),
    startTime: z.string(),
    endTime: z.string()
})