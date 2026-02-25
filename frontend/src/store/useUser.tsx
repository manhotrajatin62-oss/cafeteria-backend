import { create } from "zustand";

type UserStore = {
  showCart: boolean;
  hideSidebar: boolean;
  toggleShowCart: (value: any) => any;
  toggleSidebar: (value: any) => any;
};

export const useUser = create<UserStore>((set) => ({
  showCart: false,
  hideSidebar : false,

  toggleShowCart: (value) => {
    set({ showCart: value });
  },

  toggleSidebar: (value) => {
    set({ hideSidebar: value });
  },
}));
