// Sample products data with comprehensive filtering properties
export interface Product {
  id: number;
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

const sampleProducts: Product[] = [
  {
    id: 1,
    title: "iPhone 14 Pro Max 256GB Space Black",
    price: 56163.0,
    originalPrice: 79900.0,
    discount: 30,
    rating: 4.8,
    orders: 234,
    seller: "Apple Store Official",
    image: "",
    isNew: false,
    category: "phones",
    brand: "apple",
    colors: ["white"],
    productDetails:
      "6.7-inch Super Retina XDR OLED display with ProMotion. A16 Bionic chip for unmatched performance. 256GB storage capacity. Advanced triple-camera system with 48MP main lens and cinematic video recording. iOS 16 with Face ID, 5G connectivity, and all-day battery life."
  },
  {
    id: 2,
    title: "Samsung Galaxy S23 Ultra 512GB",
    price: 121499.00,
    originalPrice: 161999.0,
    discount: 25,
    rating: 4.7,
    orders: 189,
    seller: "Samsung Official",
    image: "",
    isNew: true,
    category: "phones",
    brand: "samsung",
    colors: ["white"],
    productDetails:
      "6.8-inch Dynamic AMOLED 2X display with 120Hz refresh rate. Snapdragon 8 Gen 2 processor with 512GB storage. Quad-camera setup with 200MP main sensor, 100x Space Zoom, and 8K video recording. S Pen support, 5G connectivity, and 5000mAh battery with fast charging."
  },
  {
    id: 3,
    title: "OnePlus Nord 5",
    price: 38500.0,
    originalPrice: 40999.0,
    discount: 6,
    rating: 4.5,
    orders: 154,
    seller: "OnePlus Ltd",
    image: "",
    isNew: false,
    category: "phones",
    brand: "oneplus",
    colors: ["white"],
    productDetails:
      "6.6-inch OLED display with 120Hz refresh rate. Kirin 9000/Qualcomm Snapdragon chipset with 128GB storage. Leica quad-camera setup with 50MP True-Chroma sensor. IP68 water and dust resistance, HarmonyOS support, and 4360mAh battery with 66W fast charging."
  },
  {
    id: 4,
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 29790.0,
    originalPrice: 34990.0,
    discount: 15,
    rating: 4.9,
    orders: 456,
    seller: "Sony Electronics",
    image: "",
    isNew: true,
    category: "headsets",
    brand: "sony",
    colors: ["blue"],
    productDetails:
      "Industry-leading active noise cancellation with dual processors. Crystal-clear audio with 30mm drivers. Up to 30 hours of battery life with quick charging. Lightweight, comfortable design with touch controls. Bluetooth 5.2 and multipoint connectivity support."
  },
  {
    id: 5,
    title: "Bose QuietComfort 45 Headphones",
    price: 27900.0,
    rating: 4.6,
    orders: 321,
    seller: "Bose Official Store",
    image: "",
    isNew: false,
    category: "headsets",
    brand: "bose",
    colors: ["black"],
    productDetails:
      "Acclaimed noise-cancelling technology with Aware Mode. High-fidelity audio with balanced sound. Lightweight over-ear design for long-term comfort. Up to 24 hours of battery life. Bluetooth 5.1 with multipoint pairing and USB-C fast charging."
  },
  {
    id: 6,
    title: "MacBook Pro 16-inch M2 Pro",
    price: 230503.0,
    originalPrice: 249900.0,
    discount: 7,
    rating: 4.8,
    orders: 89,
    seller: "Apple Store Official",
    image: "",
    isNew: true,
    category: "laptops",
    brand: "apple",
    colors: ["black"],
    productDetails:
      "16.2-inch Liquid Retina XDR display with ProMotion. Apple M2 Pro chip with up to 12-core CPU and 19-core GPU. 16GB unified memory and 512GB storage. macOS Ventura with optimized workflows for creators. All-day battery life with advanced thermal design."
  },
  {
    id: 7,
    title: "Dell XPS 13 Plus Intel i7",
    price: 210990.0,
    originalPrice: 249111.0,
    discount: 15,
    rating: 4.4,
    orders: 167,
    seller: "Dell Technologies",
    image: "",
    isNew: false,
    category: "laptops",
    brand: "dell",
    colors: ["gray"],
    productDetails:
      "13.4-inch InfinityEdge OLED display with ultra-thin bezels. Intel Core i7 12th Gen processor with 16GB RAM. 512GB SSD storage. Sleek aluminum design with zero-lattice keyboard. Windows 11 pre-installed with long battery life and fast charging support."
  },
  {
    id: 8,
    title: "Microsoft Surface Laptop 5",
    price: 107999.0,
    rating: 4.3,
    orders: 134,
    seller: "Microsoft Store",
    image: "",
    isNew: false,
    category: "laptops",
    brand: "microsoft",
    colors: ["gray"],
    productDetails:
      "13.5-inch PixelSense touchscreen display with Dolby Vision IQ. Intel Evo 12th Gen Core i5/i7 processor. 8GB RAM with 256GB SSD. Slim, lightweight design with premium Alcantara finish. All-day battery with fast charging and Windows 11 integration."
  },
  {
    id: 9,
    title: "Samsung 65-inch QLED 4K Smart TV",
    price: 149900.0,
    originalPrice: 189900.0,
    discount: 21,
    rating: 4.6,
    orders: 78,
    seller: "Samsung Electronics",
    image: "",
    isNew: true,
    category: "tv",
    brand: "samsung",
    colors: ["black"],
    productDetails:
      "65-inch Quantum Dot 4K QLED display with HDR10+. 120Hz refresh rate for smooth motion. AI-powered upscaling for enhanced picture quality. Dolby Atmos sound and Object Tracking Sound+. Smart TV features with Tizen OS and voice assistant integration."
  },
  {
    id: 10,
    title: "LG OLED 55-inch C3 Series",
    price: 164992.0,
    originalPrice: 219990.0,
    discount: 25,
    rating: 4.7,
    orders: 92,
    seller: "LG Electronics",
    image: "",
    isNew: true,
    category: "tv",
    brand: "lg",
    colors: ["black"],
    productDetails:
      "55-inch OLED display with perfect blacks and infinite contrast. α9 Gen 6 AI Processor for optimized picture and sound. Dolby Vision IQ and Dolby Atmos support. 120Hz refresh rate with NVIDIA G-SYNC and AMD FreeSync compatibility. WebOS smart platform with ThinQ AI."
  },
  {
    id: 11,
    title: "JBL Charge 5 Portable Speaker",
    price: 14999.0,
    originalPrice: 26999.0,
    discount: 44,
    rating: 4.5,
    orders: 267,
    seller: "JBL Official",
    image: "",
    isNew: false,
    category: "sound",
    brand: "jbl",
    colors: ["black"],
    productDetails:
      "Powerful portable speaker with JBL Original Pro Sound. Long-lasting 20-hour battery life. IP67 waterproof and dustproof design. Built-in powerbank for charging devices. Bluetooth 5.1 connectivity with PartyBoost for stereo pairing."
  },
  {
    id: 12,
    title: "Apple Watch Series 9 GPS 45mm",
    price: 42499.0,
    originalPrice: 44900.0,
    discount: 5,
    rating: 4.8,
    orders: 345,
    seller: "Apple Store Official",
    image: "",
    isNew: true,
    category: "watches",
    brand: "apple",
    colors: ["red"],
    productDetails:
      "45mm Retina Always-On display with up to 2000 nits brightness. S9 SiP chip with faster performance and precision dual-frequency GPS. Advanced health features including ECG, blood oxygen, and heart rate monitoring. Crash detection and 18-hour all-day battery life. WatchOS 10 with enhanced fitness tracking."
  }
];