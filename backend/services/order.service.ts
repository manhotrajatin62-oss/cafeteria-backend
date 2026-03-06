import { MSG } from "../constants/messages.ts";
import { orderRepo } from "../repos/order.repo.ts";

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

    await orderRepo.createWalletHistory({
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
      await orderRepo.createWalletHistory({
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

const checkout = async (userId: any) => {
  const cart = await orderRepo.findOneAndPopulate({ user: userId });

  if (!cart || !cart.items || (cart.items as any).length === 0) {
    throw new Error(MSG.CART.EMPTY);
  }

  const totalAmount = calculateTotalAmount(cart);

  const wallet = await orderRepo.findWallet({ user: userId });
  if (!wallet) throw new Error(MSG.WALLET.NOT_FOUND);

  const paymentStatus = await handleWalletPayment(wallet, userId, totalAmount);

  await orderRepo.createOrder({
    user: userId,
    items: cart.items.map((i: any) => ({
      item: i.item._id,
      quantity: i.quantity,
      price: i.item.price,
    })),
    totalAmount,
    paymentStatus,
    placedByAdmin: false,
    category: cart.category,
    orderStatus: "pending",
  });

  await orderRepo.deleteOne({ user: userId });
};

const confirmOrder = async (orderId: any) => {
  const order = await orderRepo.findOrderById(orderId);

  if (!order) throw new Error(MSG.ORDER.NOT_FOUND);

  if (order.orderStatus !== "pending") {
    throw new Error(MSG.ORDER.PROCESSED);
  }

  for (const oi of order.items.toObject?.() ?? order.items) {
    const item = await orderRepo.findId(oi.item);

    if (!item) throw new Error(MSG.ITEM.NOT_FOUND);
    if (item?.quantity < oi.quantity)
      throw new Error(MSG.ITEM.NOT_ENOUGH_STOCK);

    item.quantity -= oi.quantity;
    await item.save();
  }

  order.orderStatus = "confirmed";
  await order.save();

  return order;
};

const rejectOrder = async (orderId: any) => {
  const order = await orderRepo.findOrderById(orderId);

  if (!order) throw new Error(MSG.ORDER.NOT_FOUND);
  if (order.orderStatus !== "pending") {
    throw new Error(MSG.ORDER.PROCESSED);
  }

  if (order.paymentStatus === "paid") {
    const wallet = await orderRepo.findWallet({ user: order.user });

    if (!wallet) throw new Error(MSG.WALLET.NOT_FOUND);

    wallet.balance += order.totalAmount;

    await orderRepo.createWalletHistory({
      user: order.user,
      wallet: wallet._id,
      type: "credit",
      amount: order.totalAmount,
      description: "Order rejected refund",
    });

    await wallet.save();
  }

  if (order.paymentStatus === "pending") {
    const wallet = await orderRepo.findWallet({ user: order.user });

    if (!wallet) throw new Error(MSG.WALLET.NOT_FOUND);

    wallet.pendingBill -= order.totalAmount;
    if (wallet.pendingBill < 0) wallet.pendingBill = 0;

    await wallet.save();
  }

  order.orderStatus = "rejected";
  await order.save();

  return order;
};

const adminCheckout = async (userId: any) => {
  const cart = await orderRepo.findOneAndPopulate({ user: userId });

  if (!cart || !cart.items || (cart.items as any).length === 0) {
    throw new Error(MSG.CART.EMPTY);
  }

  const totalAmount = calculateTotalAmount(cart);

  const wallet = await orderRepo.findWallet({ user: userId });
  if (!wallet) throw new Error(MSG.WALLET.NOT_FOUND);

  wallet.pendingBill += totalAmount;

  await wallet.save();

  await orderRepo.createWalletHistory({
    user: userId,
    wallet: wallet._id,
    type: "debit",
    amount: totalAmount,
    description: "Admin override order",
  });

  await orderRepo.createOrder({
    user: userId,
    items: cart.items.map((i: any) => ({
      item: i.item._id,
      quantity: i.quantity,
      price: i.item.price,
    })),
    totalAmount,
    paymentStatus: "pending",
    placedByAdmin: true,
    category: cart.category,
    orderStatus: "pending",
  });

  await orderRepo.deleteOne({ user: userId });
};

export const orderService = {
  checkout,
  adminCheckout,
  confirmOrder,
  rejectOrder,
};
