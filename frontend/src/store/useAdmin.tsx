import { create } from "zustand";

type AdminStore = {
  selectedId: string;
  showInvoice: boolean;
  setSelectedId: (value: any) => any;
  setShowInvoice: (value: any) => any;
};

export const useAdmin = create<AdminStore>((set) => ({
  selectedId: "",
  showInvoice: false,
  setSelectedId: (value) => {
    set({ selectedId: value });
  },
  setShowInvoice: (value) => {
    set({ showInvoice: value });
  },
}));
