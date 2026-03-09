import { create } from "zustand";

type AdminStore = {
  selectedId: string;
  showInvoice: boolean;
  rows: any;

  setSelectedId: (value: any) => any;
  setShowInvoice: (value: any) => any;
  setRows: (value: any) => any;
};

export const useAdmin = create<AdminStore>((set) => ({
  selectedId: "",
  showInvoice: false,
  rows: [],

  setSelectedId: (value) => {
    set({ selectedId: value });
  },
  setShowInvoice: (value) => {
    set({ showInvoice: value });
  },
  setRows: (value) => {
    set({ rows: value });
  },
}));
