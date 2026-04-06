"use client";

import { Star, Ticket } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { addWishlist } from "@/utils/apis/wishlistAPI";
import { useUser } from "@/context/userContext";
import { addCart } from "@/utils/apis/cartAPI";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchSessionById } from "@/utils/apis/eventsAPI";
import { CatalogVisualPlaceholder } from "@/components/catalog-visual-placeholder";
import { useCart } from "@/context/cartContext";
import { useWishlist } from "@/context/wishlistContext";
import { Product as SessionRow } from "@/components/store";

interface SessionDetailPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  const queryClient = useQueryClient();
  const { sessionId } = React.use(params);
  const router = useRouter();
  const user = useUser();

  const { data: session } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSessionById(sessionId),
    initialData: () => {
      const catalog = queryClient.getQueryData<SessionRow[]>(["catalog"]);
      return catalog?.find((s) => s.product_id === sessionId);
    },
  });

  const addToWishlist = useWishlist((state) => state.addWishlist);

  const handleAddToWishlist = async (productId: string) => {
    await addToWishlistMutation.mutateAsync(productId);
    addToWishlist({ id: productId });
  };

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => {
      if (!user?.user?.id) throw new Error("User ID is required to save a session");
      return addWishlist(user.user.id, productId);
    },
    onSuccess: () => {
      setTimeout(() => {
        router.push("/wishlist");
      }, 800);
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
    onError: (error) => {
      console.error("Failed to save session ", error);
    },
  });

  const addZustandCart = useCart((state) => state.addCart);

  const handleAddToCart = async ({
    productId,
    price,
  }: {
    productId: string;
    price: number;
  }) => {
    await addToCartMutation.mutateAsync({ productId, price });
    addZustandCart({ id: productId, quantity: 1 });
  };

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, price }: { productId: string; price: number }) => {
      if (!user?.user?.id) throw new Error("User ID is required to register");
      return addCart(user.user.id, productId, 1, price);
    },
    onSuccess: () => {
      setTimeout(() => {
        router.push("/checkout-cart");
      }, 800);
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error) => {
      console.error("Failed to add pass ", error);
    },
  });

  if (!session) {
    return <div>Session not found</div>;
  }

  const title = session.title;
  const category = session.category;
  const price = session.price;
  const rating = session.rating;
  const orders = session.orders;
  const details =
    (session as unknown as { product_details?: string }).product_details ??
    session.productDetails;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-12">
        <div className="relative">
          <CatalogVisualPlaceholder className="aspect-4/3 h-[410px] w-full rounded-lg" iconClassName="h-16 w-16 md:h-24 md:w-24" />
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="text-sm text-gray-500">{category}</div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-gray-300 text-gray-300" />
              </div>
              <span className="text-sm text-gray-500">{rating}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${price}</span>
            {session.discount != null && session.discount > 0 && (
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
                  {session.discount}% OFF
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${(session as unknown as { original_price?: number }).original_price ?? session.originalPrice}
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">{orders} attendees registered</div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="composition" className="text-base font-medium">
                Session details
              </Label>
              <p className="text-sm text-gray-500">{details}</p>
            </div>

            <div className="flex flex-col gap-2 min-[400px]:flex-row py-8">
              <Button
                className="h-12 flex-1 text-lg"
                onClick={() =>
                  handleAddToCart({ productId: session.product_id, price: session.price })
                }
              >
                <Ticket className="mr-2 h-5 w-5" />
                Add pass to cart
              </Button>
              <Button
                className="h-12 flex-1 bg-[#D9FF66] text-lg text-gray-900 hover:bg-[#c6eb5e]"
                onClick={() => handleAddToWishlist(session.product_id)}
              >
                Save session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
