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
import { CatalogSessionMedia } from "@/components/catalog-session-media";
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

  const { data: session, error } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSessionById(sessionId),
    initialData: () => {
      const catalog = queryClient.getQueryData<SessionRow[]>(["catalog"]);
      return catalog?.find((s) => s.product_id === sessionId);
    },
    onError: (error) => {
      console.error("Failed to fetch session", error);
    }
  });

  if (!session) {
    return <div>Session not found</div>;
  }

  const title = session.title;
  const category = session.category;
  const price = session.price;
  const rating = session.rating;
  const orders = session.orders;
  const details = (session as unknown as { product_details?: string }).product_details ?? session.productDetails;
  const imageUrl = (session as unknown as { image?: string }).image;

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
    }
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
    }
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid items-start gap-10 md:grid-cols-2 lg:gap-14">
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 shadow-sm">
          <CatalogSessionMedia
            src={imageUrl}
            alt={title}
            className="aspect-4/3 min-h-[280px] w-full md:min-h-[380px]"
            iconClassName="h-16 w-16 md:h-24 md:w-24"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary/80">
              {category}
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <Star className="text-muted-foreground/35 h-4 w-4" />
              </div>
              <span className="text-muted-foreground text-sm">{rating}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">${price}</span>
            {session.discount != null && session.discount > 0 && (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
                  {session.discount}% off
                </span>
                <span className="text-muted-foreground text-lg line-through">
                  ${(session as unknown as { original_price?: number }).original_price ?? session.originalPrice}
                </span>
              </div>
            )}
          </div>
          <div className="text-muted-foreground text-sm">{orders} attendees registered</div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="composition" className="font-display text-lg font-semibold">
                Session details
              </Label>
              <p className="text-muted-foreground text-sm leading-relaxed">{details}</p>
            </div>

            <div className="flex flex-col gap-3 min-[400px]:flex-row py-6">
              <Button
                className="h-12 flex-1 rounded-xl text-base"
                onClick={() =>
                  handleAddToCart({ productId: session.product_id, price: session.price })
                }
              >
                <Ticket className="mr-2 h-5 w-5" />
                Add pass to cart
              </Button>
              <Button
                variant="outline"
                className="h-12 flex-1 rounded-xl border-2 border-primary/40 text-base hover:bg-primary/5"
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