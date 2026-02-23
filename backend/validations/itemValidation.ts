import {z} from "zod";

export const createItemSchema = z.object({
    name: z.string().min(3, "name must be at least 3 characters"),
    price: z.number().positive(),
    quantity: z.number().int().max(50, "quantity must be less than 50")
})