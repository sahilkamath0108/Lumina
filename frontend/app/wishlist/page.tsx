"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { getWishlist, removeItemFromWishlist, clearWishlist } from "@/utils/apis/wishlistAPI"
import { useUser } from "@/context/userContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useWishlist } from "@/context/wishlistContext";
import { CatalogVisualPlaceholder } from "@/components/catalog-visual-placeholder"
import Link from "next/link"

interface WishlistItem {
  wishlist_id: string;
  product_id: string;
  wishlist_item_id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
}

export default function WishlistPage() {
  const user = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: wishlistData, error } = useQuery({
    queryKey: ["wishlist", user?.user?.id],
    queryFn: () => getWishlist(user!.user!.id),
    enabled: !!user?.user?.id, // only run when user is available
  });

  const removeFromWishlist = useWishlist((state) => state.removeWishlist);
  const clearStoreWishlist = useWishlist((state) => state.clearStoreWishlist);

  const handleRemoveFromWishlist = async (wishlist_item_id: string, product_id: string) => {
    await removeFromWishlistMutation.mutateAsync(wishlist_item_id);
    removeFromWishlist(product_id);
  }

  const handleClearWishlist = async (wishlist_id: string) => {
    await clearWishlistMutation.mutateAsync(wishlist_id);
    clearStoreWishlist();
  }


  const removeFromWishlistMutation = useMutation({
    mutationFn: (wishlist_item_id: string) =>
      removeItemFromWishlist(wishlist_item_id),
    onSuccess: () => {
      // console.log("Item removed from wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist", user?.user?.id] });
    },
    onError: (error) => {
      console.error("Failed to remove wishlist item", error);
    },
  });

  const clearWishlistMutation = useMutation({
    mutationFn: (wishlist_id: string) => clearWishlist(wishlist_id),
    onSuccess: () => {
      // console.log("Wishlist cleared");
      queryClient.invalidateQueries({ queryKey: ["wishlist", user?.user?.id] });
    },
  });

  // if (isLoading) return <Progress />;
  if (error) return <div>Sorry, there was an error fetching this wishlist</div>;

  const wishlist = wishlistData?.data || [];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Saved sessions</h1>
        <Button
          variant="outline"
          onClick={() => handleClearWishlist(wishlist[0]?.wishlist_id)}
          disabled={clearWishlistMutation.isPending}
        >
          Clear saved list
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {
          wishlist.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <h2 className="text-lg font-medium">No sessions saved yet</h2>
              <Link href="/home">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                  Browse catalog
                </Button>
              </Link>
            </div>
          )
        }
        {wishlist.map((item: WishlistItem) => (
          <Card key={item.wishlist_item_id}>
            <div className="cursor-pointer" onClick={() => router.push(`/session/${item.product_id}`)}>
              <CardHeader className="p-0">
                <CatalogVisualPlaceholder className="aspect-square w-full rounded-t-lg" iconClassName="h-14 w-14" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
                </div>
              </CardContent>
            </div>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleRemoveFromWishlist(item.wishlist_item_id, item.product_id)
                }
                disabled={removeFromWishlistMutation.isPending}
              >
                Remove from saved
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
