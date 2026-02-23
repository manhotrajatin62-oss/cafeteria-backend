import Category from "../models/Category.ts";

const findAndPopulate = async () => {
    return Category.find().populate("items")
}

export const menuRepo = {
    findAndPopulate
}