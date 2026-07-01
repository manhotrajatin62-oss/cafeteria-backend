import {z} from "zod";

export const createItemSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    price: z.number().positive(),
    quantity: z.number().int().max(50, "Quantity must be less than 50")
})