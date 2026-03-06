import { itemRepo } from "../repos/item.repo.ts";
import { MSG } from "../constants/messages.ts";

const createItem = async (data: any) => {
  const existingItem = await itemRepo.findByName(data.name);

  if (existingItem) {
    throw new Error(MSG.ITEM.EXISTS);
  }

  const item = await itemRepo.createItem(data);
  return item;
};

const getItems = async () => {
  const items = await itemRepo.findItems();
  return items;
};

const updateItem = async (id: any, data: any) => {
  const item = await itemRepo.findAndUpdate(id, data);
  return item;
};

const deleteItem = async (id: any) => {
  const item = await itemRepo.deleteItem(id);
  return item;
};

export const itemService = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
