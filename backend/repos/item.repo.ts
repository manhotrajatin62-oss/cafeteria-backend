import Item from "../models/Item.ts";

const createItem = async (data: any) => {
  return Item.create(data);
};

const findItems = async () => {
  return Item.find();
};

const findAndUpdate = async (id: any, data: any) => {
  return Item.findByIdAndUpdate(id, data, { new: true });
};

const deleteItem = async (id: any) => {
  return Item.findByIdAndDelete(id);
};

export const itemRepo = {
  createItem,
  findItems,
  findAndUpdate,
  deleteItem,
};
