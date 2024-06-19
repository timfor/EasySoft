import { create } from "zustand";

const useCatalogStore = create((set) => ({
  sortByPrice: "", // 'asc' или 'desc'
  selectedCategory: "",
  itemsPerPage: 10,
  setSortByPrice: (sort) => set({ sortByPrice: sort }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setItemsPerPage: (number) => set({ itemsPerPage: number }),
}));

export default useCatalogStore;
