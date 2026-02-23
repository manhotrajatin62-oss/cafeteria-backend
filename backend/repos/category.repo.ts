import Category from "../models/Category.ts";

const findCategories = async () => {
  return Category.find().populate("items");
};

const findId = async (id: any) => {
  return Category.findById(id);
};

const findCategory = async (data: any) => {
  return Category.findOne(data);
};

const createData = async (data: any) => {
  return Category.create(data);
};

const findAndDelete = async (id:any) => {
  return Category.findByIdAndDelete(id)
}

export const categoryRepo = {
  findCategories,
  createData,
  findId,
  findCategory,
  findAndDelete
};
