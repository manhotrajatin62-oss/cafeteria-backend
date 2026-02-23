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

const calculateTotalAmount = (cart: any) => {
  return cart.items.reduce(
    (total: number, i: any) => total + i.quantity * i.item.price,
    0,
  );
};

const handleWalletPayment = async (
  wallet: any,
  userId: any,
  totalAmount: number,
) => {
  let paymentStatus: "paid" | "pending" = "paid";
  if (wallet.balance >= totalAmount) {
    wallet.balance -= totalAmount;
    await cartRepo.createWalletHistory({
      user: userId,
      wallet: wallet._id,
      type: "debit",
      amount: totalAmount,
      description: "Order payment",
    });
  } else {
    const remaining = totalAmount - wallet.balance;
    if (wallet.pendingBill + remaining > wallet.creditLimit) {
      throw new Error(MSG.WALLET.CREDIT_LIMIT_CROSSED);
    }
    if (wallet.balance > 0) {
      await cartRepo.createWalletHistory({
        user: userId,
        wallet: wallet._id,
        type: "debit",
        amount: wallet.balance,
        description: "Partial order payment",
      });
    }
    wallet.balance = 0;
    wallet.pendingBill += remaining;
    paymentStatus = "pending";
  }
  await wallet.save();
  return paymentStatus;
};

const validateAndUpdateStock = async (cart: any) => {
  for (const ci of cart.items) {
    if (!ci.item) throw new Error(MSG.CART.INVALID);
    if (typeof ci.quantity !== "number")
      throw new TypeError(MSG.CART.INVALID_QUANTITY);

    const item = await cartRepo.findId(ci.item);

    if (!item) throw new Error(MSG.ITEM.NOT_FOUND);
    if (typeof item.quantity !== "number")
      throw new TypeError(MSG.ITEM.CORRUPTED);

    if (item.quantity < ci.quantity) throw new Error(MSG.ITEM.NOT_ENOUGH_STOCK);

    item.quantity -= ci.quantity;
    await item.save();
  }
};

const checkout = async (userId: any) => {
  const cart = await cartRepo.findOneAndPopulate({ user: userId });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error(MSG.CART.EMPTY);
  }

  const totalAmount = calculateTotalAmount(cart);

  const wallet = await cartRepo.findWallet({ user: userId });

  if (!wallet) {
    throw new Error(MSG.WALLET.NOT_FOUND);
  }

  const paymentStatus = await handleWalletPayment(wallet, userId, totalAmount);

  const categoryId = cart.category;

  await cartRepo.createOrder({
    user: userId,
    items: cart.items.map((i: any) => ({
      item: i.item._id,
      quantity: i.quantity,
      price: i.item.price,
    })),
    totalAmount,
    paymentStatus,
    placedByAdmin: false,
    category: categoryId,
  });

  await validateAndUpdateStock(cart);

  await cartRepo.deleteOne({ user: userId });
};

const adminCheckout = async (userId: any) => {
  const cart = await cartRepo.findOneAndPopulate({ user: userId });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error(MSG.CART.EMPTY);
  }

  let totalAmount = 0;

  cart.items.forEach((i: any) => {
    totalAmount += i.quantity * i.item.price;
  });

  const wallet = await cartRepo.findWallet({ user: userId });

  if (!wallet) {
    throw new Error(MSG.WALLET.NOT_FOUND);
  }

  wallet.pendingBill += totalAmount;

  await wallet.save();

  await cartRepo.createWalletHistory({
    user: userId,
    wallet: wallet._id,
    type: "debit",
    amount: totalAmount,
    description: "Admin override order",
  });

  const categoryId = cart.category;

  await cartRepo.createOrder({
    user: userId,
    items: cart.items.map((i: any) => ({
      item: i.item._id,
      quantity: i.quantity,
      price: i.item.price,
    })),
    totalAmount,
    paymentStatus: "pending",
    placedByAdmin: true,
    category: categoryId,
  });

  for (const ci of cart.items) {
    if (!ci.item) throw new Error(MSG.CART.INVALID);
    if (typeof ci.quantity !== "number")
      throw new TypeError(MSG.CART.INVALID_QUANTITY);

    const item = await cartRepo.findId(ci.item);

    if (!item) throw new Error(MSG.ITEM.NOT_FOUND);
    if (typeof item.quantity !== "number")
      throw new TypeError(MSG.ITEM.CORRUPTED);

    if (item.quantity < ci.quantity) throw new Error(MSG.ITEM.NOT_ENOUGH_STOCK);

    item.quantity -= ci.quantity;
    await item.save();
  }

  await cartRepo.deleteOne({ user: userId });
};

export const cartService = {
  addToCart,
  updateQuantity,
  getCart,
  deleteCartItem,
  checkout,
  adminCheckout,
};
