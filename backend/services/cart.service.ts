import { MSG } from "../constants/messages.ts";
import { cartRepo } from "../repos/cart.repo.ts";
import { isWithinTime } from "../utils/timeCheck.ts";

const calcTotal = async (cart: any) => {
  let total = 0;

  for (let ci of cart.items) {
    const item = await cartRepo.findId(ci.item);

    if (item) total += (item.price ?? 0) * ci.quantity;
  }

  await cart.populate("items.item");

  cart.totalBill = cart.items.reduce(
    (acc: any, ci: any) => acc + ci.item.price * ci.quantity,
    0,
  );
};

export const addToCart = async (data: any, userId: any) => {
  const { categoryId, itemId } = data;

  const category = await cartRepo.findCategoryId(categoryId);
  if (!category) throw new Error(MSG.CATEGORY.NOT_FOUND);

  if (
    !category.startTime ||
    !category.endTime ||
    !isWithinTime(category.startTime, category.endTime)
  )
    throw new Error(MSG.CATEGORY.TIME_OVER);

  const itemExistsInCategory = category.items.some(
    (i: any) => i.toString() === itemId,
  );

  if (!itemExistsInCategory) throw new Error(MSG.CATEGORY.ITEM_NOT_FOUND);

  const item = await cartRepo.findId(itemId);
  if (!item) throw new Error(MSG.ITEM.NOT_FOUND);
  if ((item.quantity ?? 0) <= 0) throw new Error(MSG.ITEM.OUT_OF_STOCK);

  let cart = await cartRepo.findOne({ user: userId });

  if (!cart) {
    cart = await cartRepo.createCart({
      user: userId,
      category: categoryId,
      items: [],
    });
  }

  if (cart.category && cart.category.toString() !== categoryId.toString()) {
    throw new Error(MSG.CART.MULTI_CATEGORY_NOT_ALLOWED);
  }

  const alreadyInCart = cart.items.some(
    (i: any) => i.item.toString() === itemId,
  );

  if (alreadyInCart) {
    throw new Error(MSG.CART.EXISTS);
  }

  cart.items.push({
    item: itemId,
    quantity: 1,
  });

  await cart.save();

  return cart;
};

const updateQuantity = async (id: any, data: any) => {
  const { itemId, quantity } = data;

  if (quantity < 0) {
    throw new Error(MSG.INVALID_QUANTITY);
  }

  const item = await cartRepo.findId(itemId);

  if (!item) throw new Error(MSG.ITEM.NOT_FOUND);

  if (quantity > (item.quantity ?? 0)) {
    throw new Error(MSG.ITEM.NOT_ENOUGH_STOCK);
  }

  const cart = await cartRepo.findOne({ user: id });

  if (!cart) {
    throw new Error(MSG.CART.NOT_FOUND);
  }

  const cartItem = cart.items.find((i: any) => i.item.toString() === itemId);

  if (!cartItem) throw new Error(MSG.CART.NOT_IN_CART);

  if (quantity == 0) {
    const index = cart.items.findIndex(
      (i: any) => i.item.toString() === itemId,
    );
    cart.items.splice(index, 1);
  } else {
    cartItem.quantity = quantity;
  }

  await calcTotal(cart);
  await cart.save();
  return cart;
};

const getCart = async (userId: any) => {
  const cart = await cartRepo.findOneAndPopulate({ user: userId });

  if (!cart || !cart.items || cart.items.length === 0) {
    return {
      user: userId,
      category: null,
      items: [],
    };
  }

  return cart;
};

const deleteCartItem = async (id: any, userId: any) => {
  const cart = await cartRepo.findOne({ user: userId });

  if (!cart) {
    throw new Error(MSG.CART.NOT_FOUND);
  }

  const exists = cart.items.some((i: any) => i.item.toString() === id);

  if (!exists) {
    throw new Error(MSG.CART.NOT_IN_CART);
  }

  const index = cart.items.findIndex((i: any) => i.item.toString() === id);
  cart.items.splice(index, 1);

  await calcTotal(cart);
  await cart.save();
  return cart;
};

export const cartService = {
  addToCart,
  updateQuantity,
  getCart,
  deleteCartItem
};
