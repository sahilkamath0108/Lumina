"use client";

import { useEffect, useState } from "react";
import { Search, Grid3X3, List, Heart, Star, ShoppingCart, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProductStore } from "./store";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllSessions } from "@/utils/apis/eventsAPI";
import { addWishlist } from "@/utils/apis/wishlistAPI";
import { useUser } from "@/context/userContext";
import FilterSection from './product-filter';
import { addCart } from "@/utils/apis/cartAPI";
import { useCart } from "@/context/cartContext";
import { useWishlist } from "@/context/wishlistContext";
import { FaHeart } from "react-icons/fa";
import { CatalogSessionMedia } from "@/components/catalog-session-media";
import { Product } from './store'

export default function ProductList() {
  const {
    filteredProducts,
    searchQuery,
    viewMode,
    setSearchQuery,
    setViewMode,
    applyFilters
  } = useProductStore();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: productsData, error } = useQuery({
    queryKey: ["catalog"],
    queryFn: async () => await getAllSessions()
  });

  const router = useRouter();

  const setProducts = useProductStore((state) => state.setProducts);

  useEffect(() => {
    if (productsData) {
      // console.log("Fetched products list ", productsData)
      setProducts(productsData); // populate Zustand store
    }
  }, [productsData, setProducts]);

  // console.log("Filtered products ", filteredProducts)

  // Apply initial filters on mount
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const user = useUser();
  // console.log("User is ", user)
  const queryClient = useQueryClient();

  const addToWishlist = useWishlist((state) => state.addWishlist);
  const wishlist = useWishlist((state) => state.wishlist);

  const handleAddToWishlist = async (productId: string) => {
    await addToWishlistMutation.mutateAsync(productId);
    addToWishlist({ id: productId });
  }

  // Mutation hook
  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => {
      if (!user?.user?.id) throw new Error("User ID is required to add to wishlist");
      return addWishlist(user.user.id, productId);
    },
    onSuccess: () => {
      // console.log("Item added to wishlist ");
      setTimeout(() => {
        router.push("/wishlist"); // navigate after short delay
      }, 800);
      // invalidate & refetch wishlist data
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
    onError: (error) => {
      console.error("Failed to add wishlist item ", error);
    },
  });

  const addZustandCart = useCart((state) => state.addCart);
  const cart = useCart((state) => state.cart);

  // Resetting user store
  // useEffect(() => {
  //   useCart.persist.clearStorage();
  //   useWishlist.persist.clearStorage();
  // }, []);

  const handleAddToCart = async ({ productId, price }: { productId: string; price: number }) => {
    await addToCartMutation.mutateAsync({ productId, price });
    addZustandCart({ id: productId, quantity: 1 });
  };

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, price }: { productId: string; price: number }) => {
      if (!user?.user?.id) throw new Error("User ID is required to add to cart");
      return addCart(user.user.id, productId, 1, price);
    },
    onSuccess: () => {
      // console.log(productId, price)
      // console.log("Item added to cart ");
      setTimeout(() => {
        router.push("/checkout-cart");
      }, 800);
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error) => {
      console.error("Failed to add cart item ", error);
    },
  });

  // if (isLoading) return <Progress />;
  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error";
    return (
      <div className="mx-auto max-w-2xl rounded-lg border p-6">
        <div className="text-lg font-semibold">Catalog failed to load</div>
        <div className="text-muted-foreground mt-2 text-sm">
          {message}
        </div>
        <div className="text-muted-foreground mt-4 text-sm">
          Common causes: missing <code>NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
          <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY</code>, or the
          browser session not being created after OAuth redirect.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="lg:sticky lg:top-24">
            <FilterSection />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Controls Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:mb-8">
            <div className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Session catalog
            </div>
            {/* Top row - Mobile filter button and product count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-transparent lg:hidden">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 sm:w-96">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-full pr-4">
                      <div className="py-4">
                        <FilterSection />
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>

                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  {filteredProducts.length} sessions
                </div>
              </div>
            </div>

            {/* Bottom row - Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search sessions, hosts, tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border-border/80 bg-card/80 pl-10 sm:w-72"
                />
              </div>

              {/* View Toggle - Mobile */}
              <div className="sm:hidden">
                <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
                  <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
                    <Grid3X3 className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view" size="sm">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          {/* Session grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                No sessions match your filters.
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-4 sm:gap-6 ${viewMode === "grid"
                ? "xs:grid-cols-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
                }`}>
              {filteredProducts.map((product: Product) => (
                <Card
                  key={product.product_id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                >
                  <CardContent className="flex flex-1 flex-col p-3 sm:p-4">
                    <div className="mb-4 cursor-pointer" onClick={() => router.push(`/session/${product.product_id}`)}>
                      <div className="relative mb-3 sm:mb-4">
                        <CatalogSessionMedia
                          src={product.image}
                          alt={product.title}
                          className="h-40 w-full rounded-xl sm:h-48"
                          iconClassName="h-12 w-12 sm:h-14 sm:w-14"
                        />
                        {product.isNew && (
                          <Badge className="absolute left-2 top-2 rounded-full border-0 bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                            New
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug tracking-tight">
                          {product.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-bold text-primary sm:text-xl">
                            ₹{product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <>
                              <span className="text-muted-foreground text-xs line-through sm:text-sm">
                                ₹{product.originalPrice.toFixed(2)}
                              </span>
                              <Badge variant="secondary" className="rounded-full text-xs font-medium">
                                −{product.discount}%
                              </Badge>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(product.rating)
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-muted-foreground/40"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-muted-foreground text-xs">{product.rating}</span>
                        </div>

                        <p className="text-muted-foreground text-xs">
                          {product.orders} seats booked this week
                        </p>

                        <p className="text-muted-foreground text-xs">Host: {product.seller}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex gap-2 border-t border-border/50 pt-3">
                      <Button
                        className="flex-1 rounded-xl"
                        size="sm"
                        disabled={cart.some((item) => item.id === product.product_id)}
                        onClick={() => handleAddToCart({ productId: product.product_id, price: product.price })}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>
                          {cart.some((item) => item.id === product.product_id)
                          ? "In cart"
                            : "Add pass"}
                        </span>
                      </Button>
                      <Button
                        disabled={wishlist.some((item) => item.id === product.product_id)}
                        onClick={() => handleAddToWishlist(product.product_id)}
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-border/80 bg-transparent px-2 sm:px-3"
                      >
                        {wishlist.some((item) => item.id === product.product_id)
                          ? <FaHeart className="h-4 w-4" />
                          : <Heart className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// export default function ProductList() {
//   const {
//     filteredProducts,
//     searchQuery,
//     viewMode,
//     setSearchQuery,
//     setViewMode,
//     applyFilters
//   } = useProductStore();

//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

//   const { data: productsData, error } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => await getAllProducts()
//   });

//   const router = useRouter();

//   const setProducts = useProductStore((state) => state.setProducts);

//   useEffect(() => {
//     if (productsData) {
//       setProducts(productsData); // populate Zustand store
//       // Apply filters AFTER products are loaded
//       applyFilters();
//     }
//   }, [productsData, setProducts, applyFilters]);

//   // REMOVED: Don't apply filters on mount separately
//   // This was causing filters to run before products were loaded

//   const user = useUser();
//   const queryClient = useQueryClient();

//   const addToWishlist = useWishlist((state) => state.addWishlist);
//   const wishlist = useWishlist((state) => state.wishlist);

//   const handleAddToWishlist = async (productId: string) => {
//     await addToWishlistMutation.mutateAsync(productId);
//     addToWishlist({ id: productId });
//   }

//   // Mutation hook
//   const addToWishlistMutation = useMutation({
//     mutationFn: (productId: string) => {
//       if (!user?.user?.id) throw new Error("User ID is required to add to wishlist");
//       return addWishlist(user.user.id, productId);
//     },
//     onSuccess: () => {
//       setTimeout(() => {
//         router.push("/wishlist");
//       }, 800);
//       queryClient.invalidateQueries({ queryKey: ["wishlists"] });
//     },
//     onError: (error) => {
//       console.error("Failed to add wishlist item ", error);
//     },
//   });

//   const addZustandCart = useCart((state) => state.addCart);
//   const cart = useCart((state) => state.cart);

//   // REMOVED: This was clearing your persisted cart/wishlist on every mount!
//   // Only clear storage when you actually want to reset (e.g., on logout)
//   // useEffect(() => {
//   //   useCart.persist.clearStorage();
//   //   useWishlist.persist.clearStorage();
//   // }, []);

//   const handleAddToCart = async ({ productId, price }: { productId: string; price: number }) => {
//     await addToCartMutation.mutateAsync({ productId, price });
//     addZustandCart({ id: productId, quantity: 1 });
//   };

//   const addToCartMutation = useMutation({
//     mutationFn: ({ productId, price }: { productId: string; price: number }) => {
//       if (!user?.user?.id) throw new Error("User ID is required to add to cart");
//       return addCart(user.user.id, productId, 1, price);
//     },
//     onSuccess: () => {
//       setTimeout(() => {
//         router.push("/checkout-cart");
//       }, 800);
//       queryClient.invalidateQueries({ queryKey: ["carts"] });
//     },
//     onError: (error) => {
//       console.error("Failed to add cart item ", error);
//     },
//   });

//   if (error) return <div>Sorry There was an Error</div>;

//   return (
//     <div>
//       <div className="flex flex-col gap-6 lg:flex-row">
//         {/* Desktop Filters Sidebar */}
//         <aside className="hidden w-64 lg:block">
//           <FilterSection />
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1">
//           {/* Controls Bar */}
//           <div className="mb-4 flex flex-col gap-4 sm:mb-6">
//             {/* Top row - Mobile filter button and product count */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 {/* Mobile Filter Button */}
//                 <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
//                   <SheetTrigger asChild>
//                     <Button variant="outline" size="sm" className="bg-transparent lg:hidden">
//                       <Filter className="mr-2 h-4 w-4" />
//                       Filters
//                     </Button>
//                   </SheetTrigger>
//                   <SheetContent side="left" className="w-80 sm:w-96">
//                     <SheetHeader>
//                       <SheetTitle>Filters</SheetTitle>
//                     </SheetHeader>
//                     <ScrollArea className="h-full pr-4">
//                       <div className="py-4">
//                         <FilterSection />
//                       </div>
//                     </ScrollArea>
//                   </SheetContent>
//                 </Sheet>

//                 <div className="text-muted-foreground flex items-center gap-2 text-sm">
//                   {filteredProducts.length} products
//                 </div>
//               </div>
//             </div>

//             {/* Bottom row - Search */}
//             <div className="flex items-center gap-4">
//               <div className="relative flex-1 sm:flex-initial">
//                 <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
//                 <Input
//                   placeholder="Search products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 sm:w-64"
//                 />
//               </div>

//               {/* View Toggle - Mobile */}
//               <div className="sm:hidden">
//                 <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
//                   <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
//                     <Grid3X3 className="h-4 w-4" />
//                   </ToggleGroupItem>
//                   <ToggleGroupItem value="list" aria-label="List view" size="sm">
//                     <List className="h-4 w-4" />
//                   </ToggleGroupItem>
//                 </ToggleGroup>
//               </div>
//             </div>
//           </div>

//           {/* Product Grid */}
//           {filteredProducts.length === 0 ? (
//             <div className="py-12 text-center">
//               <p className="text-muted-foreground text-lg">
//                 No products found matching your filters.
//               </p>
//               <p className="text-muted-foreground mt-2 text-sm">
//                 Try adjusting your search criteria.
//               </p>
//             </div>
//           ) : (
//             <div
//               className={`grid gap-4 sm:gap-6 ${viewMode === "grid"
//                 ? "xs:grid-cols-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
//                 : "grid-cols-1"
//                 }`}>
//               {filteredProducts.map((product: Product) => (
//                 <Card key={product.product_id} className="group transition-shadow hover:shadow-lg h-full flex flex-col">
//                   <CardContent className="p-2 sm:p-4 flex flex-col flex-1">
//                     <div className="mb-4 cursor-pointer" onClick={() => router.push(`/product-details/${product.product_id}`)}>
//                       <div className="relative mb-3 sm:mb-4">
//                         <Image
//                           (catalog uses CatalogVisualPlaceholder — no image URLs)
//                           alt={product.title}
//                           className="h-40 w-full rounded-md object-cover sm:h-48"
//                         />
//                         {product.isNew && (
//                           <Badge className="absolute top-2 left-2 bg-red-500 text-xs hover:bg-red-600">
//                             New
//                           </Badge>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <h3 className="line-clamp-2 text-sm leading-tight font-medium">
//                           {product.title}
//                         </h3>

//                         <div className="flex flex-wrap items-center gap-2">
//                           <span className="text-base font-bold text-blue-600 sm:text-lg">
//                             ₹{product.price.toFixed(2)}
//                           </span>
//                           {product.originalPrice && (
//                             <>
//                               <span className="text-muted-foreground text-xs line-through sm:text-sm">
//                                 ₹{product.originalPrice.toFixed(2)}
//                               </span>
//                               <Badge variant="destructive" className="text-xs">
//                                 -{product.discount}%
//                               </Badge>
//                             </>
//                           )}
//                         </div>

//                         <div className="flex items-center gap-1">
//                           <div className="flex items-center">
//                             {[...Array(5)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 className={`h-3 w-3 ${i < Math.floor(product.rating)
//                                   ? "fill-yellow-400 text-yellow-400"
//                                   : "text-gray-300"
//                                   }`}
//                               />
//                             ))}
//                           </div>
//                           <span className="text-muted-foreground text-xs">{product.rating}</span>
//                         </div>

//                         <p className="text-muted-foreground text-xs">
//                           {product.orders} orders this week
//                         </p>

//                         <p className="text-muted-foreground text-xs">Seller: {product.seller}</p>
//                       </div>
//                     </div>

//                     <div className="mt-auto flex gap-2 pt-2">
//                       <Button className="flex-1" size="sm"
//                         disabled={cart.some((item) => item.id === product.product_id)}
//                         onClick={() => handleAddToCart({ productId: product.product_id, price: product.price })}
//                       >
//                         <ShoppingCart className="h-4 w-4" />
//                         <span>
//                           {cart.some((item) => item.id === product.product_id)
//                           ? "Added !"
//                             : "Add to cart"}
//                         </span>
//                       </Button>
//                       <Button
//                         disabled={wishlist.some((item) => item.id === product.product_id)}
//                         onClick={() => handleAddToWishlist(product.product_id)}
//                         variant="outline"
//                         size="sm"
//                         className="bg-transparent px-2 sm:px-3"
//                       >
//                         {wishlist.some((item) => item.id === product.product_id)
//                           ? <FaHeart className="h-4 w-4" />
//                           : <Heart className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }