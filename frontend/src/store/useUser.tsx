import { create } from "zustand";
import { updateCartQuantity } from "../api/cartApi";
import toast from "react-hot-toast";

type CartItem = {
  item: {
    _id: string;
  };
  quantity: number;
};

type UserStore = {
  showCart: boolean;
  hideSidebar: boolean;

  cartItems: CartItem[];

  qtyMap: Record<string, number>;

  addItem: (itemId: string) => void;

  toggleShowCart: (value: boolean) => void;
  toggleSidebar: (value: boolean) => void;

  setCartItems: (items: CartItem[]) => void;

  increment: (itemId: string) => void;
  decrement: (itemId: string, itemName:string) => void;
};

const debounceTimers: Record<string, NodeJS.Timeout> = {};

export const useUser = create<UserStore>((set, get) => ({
  showCart: false,
  hideSidebar: false,

  cartItems: [],
  qtyMap: {},

  addItem: (itemId) => {
    const { qtyMap } = get();

    set({
      qtyMap: {
        ...qtyMap,
        [itemId]: 1,
      },
    });
  },

  toggleShowCart: (value) => set({ showCart: value }),

  toggleSidebar: (value) => set({ hideSidebar: value }),

  setCartItems: (items) => {
    const map: Record<string, number> = {};

    items.forEach((i) => {
      map[i.item._id] = i.quantity;
    });

    set({
      cartItems: items,
      qtyMap: map,
    });
  },

  increment: (itemId) => {
    const { qtyMap } = get();
    const qty = qtyMap[itemId] || 0;

    if (qty >= 50) return;

    const newQty = qty + 1;

    set({
      qtyMap: {
        ...qtyMap,
        [itemId]: newQty,
      },
    });

    clearTimeout(debounceTimers[itemId]);

    debounceTimers[itemId] = setTimeout(async () => {
      try {
        await updateCartQuantity({
          itemId,
          quantity: newQty,
        });
      } catch (err) {
        console.error(err);
      }
    }, 600);
  },

  decrement: (itemId: string, itemName: string) => {
  const { qtyMap } = get();
  const qty = qtyMap[itemId];

  if (!qty) return;

  const newQty = qty <= 1 ? 0 : qty - 1;

  const newMap = { ...qtyMap };

  if (newQty === 0) {
    delete newMap[itemId];

    toast.success(`${itemName} removed from the cart`);
  } else {
    newMap[itemId] = newQty;
  }

  set({ qtyMap: newMap });

  clearTimeout(debounceTimers[itemId]);

  debounceTimers[itemId] = setTimeout(async () => {
    try {
      await updateCartQuantity({
        itemId,
        quantity: newQty,
      });
    } catch (err) {
      console.error(err);
    }
  }, 600);
}

}));
