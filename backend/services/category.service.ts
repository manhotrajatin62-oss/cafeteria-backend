import { categoryRepo } from "../repos/category.repo.ts";
import { MSG } from "../constants/messages.ts";

const getCategories = async () => {
  const categories = await categoryRepo.findCategories();

  if (!categories.length) {
    throw new Error(MSG.CATEGORY.NOT_AVAILABLE);
  }

  return categories;
};

const createCategory = async (data: any) => {
  const { name, startTime, endTime } = data;

  const exists = await categoryRepo.findCategory({
    $or: [{ name }, { startTime, endTime }],
  });

  if (exists) {
    throw new Error(MSG.CATEGORY.EXISTS);
  }

  const category = await categoryRepo.createData({
    name,
    startTime,
    endTime,
    items: [],
  });

  return category;
};

const addItemToCategory = async (data: any) => {
  const { categoryId, itemId } = data;

  const category = await categoryRepo.findId(categoryId);
  if (!category) throw new Error(MSG.CATEGORY.NOT_FOUND);

  if (category.items.includes(itemId)) {
    throw new Error(MSG.CATEGORY.ITEM_EXISTS);
  }

  category.items.push(itemId);

  await category.save();

  return category;
};

const removeItemFromCategory = async (data: any) => {
  const { categoryId, itemId } = data;

  const category = await categoryRepo.findId(categoryId);

  if (!category) {
    throw new Error(MSG.CATEGORY.NOT_FOUND);
  }

  if (!category.items.includes(itemId)) {
    throw new Error(MSG.CATEGORY.ITEM_NOT_FOUND);
  }

  category.items = category.items.filter((id: any) => id.toString() !== itemId);

  await category.save();

  return category;
};

const deleteCategory = async (data: any) => {
  const { categoryId } = data;

  const category = await categoryRepo.findId(categoryId);

  if (!category) throw new Error(MSG.CATEGORY.NOT_FOUND);

  const deleted = await categoryRepo.findAndDelete(categoryId);

  return deleted;
};

export const categoryService = {
  getCategories,
  createCategory,
  addItemToCategory,
  removeItemFromCategory,
  deleteCategory,
};
