import { MSG } from "../constants/messages.ts";
import { customersRepo } from "../repos/customers.repo.ts";

const getCustomers = async () => {
  const users = await customersRepo.findUsers({ role: "user" });

  const customers = await Promise.all(
    users.map(async (user: any) => {
      const wallet = await customersRepo.findWallet({ user: user._id });

      const orders = await customersRepo.findOrder({ user: user._id });

      return {
        ...user.toObject(),
        wallet,
        ordersCount: orders.length,
      };
    }),
  );

  return customers;
};

export const updateCustomerInfo = async (
  id: string,
  data: { name?: string; email?: string },
) => {
  const updatedCustomer = await customersRepo.findIdAndUpdate(id, data);

  if (!updatedCustomer) {
    throw new Error(MSG.CUSTOMERS.NOT_FOUND);
  }

  return updatedCustomer;
};

export const deleteCustomer = async (id: any) => {
  const deletedCustomer = await customersRepo.findIdAndDelete(id);

  if (!deletedCustomer) {
    throw new Error(MSG.CUSTOMERS.NOT_FOUND);
  }

  return deletedCustomer;
};

export const customersService = {
  getCustomers,
  updateCustomerInfo,
  deleteCustomer,
};
