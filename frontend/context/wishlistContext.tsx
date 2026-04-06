import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WishlistItem = {
  id: string;
};

type WishlistState = {
  count: number;
  wishlist: WishlistItem[];
  addWishlist: (item: WishlistItem) => void;
  removeWishlist: (id: string) => void;
  clearStoreWishlist: () => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      count: 0,
      wishlist: [],
      clearStoreWishlist: () => set({ wishlist: [], count: 0 }),

      addWishlist: (item) =>
        set((state) => {
          const existingItem = state.wishlist.find(
            (wishItem) => wishItem.id === item.id
          );
          if (existingItem) {
            // item already in wishlist, do nothing
            return state;
          }
          return {
            count: state.count + 1,
            wishlist: [...state.wishlist, item],
          };
        }),

      removeWishlist: (id) =>
        set((state) => ({
          count: state.count - 1,
          wishlist: state.wishlist.filter((item) => item.id !== id),
        })),
    }),
    { name: 'wishlist-storage' }
  )
);

