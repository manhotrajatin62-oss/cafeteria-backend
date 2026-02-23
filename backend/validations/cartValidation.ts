import {z} from "zod";

export const addCartSchema = z.object({
    itemId: z.string().min(1)
})

export const updateQuantitySchema = z.object({
    itemId: z.string().min(1),
    quantity: z.number().int().min(0)
})