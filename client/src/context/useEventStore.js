import { create } from "zustand";

export const useEventStore = create((set) => ({
  event: null,
  setEvent: (event) => set({ event }),
}));
