import { MSG } from "../constants/messages.ts";
import { menuRepo } from "../repos/menu.repo.ts";

const getTodayMenu = async () => {

  const categories = await menuRepo.findAndPopulate();

  if (!categories || categories.length == 0)
    throw new Error(MSG.MENU.NOT_AVAILABLE);

  return categories;
};

export const menuService = {
  getTodayMenu,
};
