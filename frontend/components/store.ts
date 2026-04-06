import { create } from "zustand";

export interface Product {
  product_id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  orders: number;
  seller: string;
  image: string;
  isNew: boolean;
  category: string;
  brand: string;
  colors: string[];
  productDetails: string;
}

interface ProductStore {
  // State
  products: Product[];
  filteredProducts: Product[];
  selectedCategory: string;
  searchQuery: string;
  priceRange: [number, number];
  selectedBrands: string[];
  selectedColors: string[];
  viewMode: string;

  // Actions
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleBrand: (brand: string) => void;
  toggleColor: (color: string) => void;
  setProducts: (products: Product[]) => void;
  setViewMode: (mode: string) => void;
  applyFilters: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  filteredProducts: [],
  selectedCategory: "all",
  searchQuery: "",
  priceRange: [0, 3000],
  selectedBrands: [],
  selectedColors: [],
  viewMode: "grid",

  setProducts: (products: Product[]) => {
    set({ products, filteredProducts: products });
  },

  // Actions
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().applyFilters();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setPriceRange: (range) => {
    set({ priceRange: range });
    get().applyFilters();
  },

  toggleBrand: (brand) => {
    const { selectedBrands } = get();
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    set({ selectedBrands: newBrands });
    get().applyFilters();
  },

  toggleColor: (color) => {
    const { selectedColors } = get();
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    set({ selectedColors: newColors });
    get().applyFilters();
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  applyFilters: () => {
    const {
      products,
      selectedCategory,
      searchQuery,
      priceRange,
      selectedBrands,
      selectedColors,
      // deliveryDate
    } = get();

    let filtered = products;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.seller.toLowerCase().includes(query)
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => selectedBrands.includes(product.brand));
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors.some((color) => selectedColors.includes(color))
      );
    }

    set({ filteredProducts: filtered });
  }
}));