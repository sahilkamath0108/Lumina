"use client";

import { Button } from "@/components/ui/button";
import { CartItem } from "./ui/cart-item";
import { OrderSummary } from "./ui/order-summary";
import Link from "next/link";
import { fetchCart, removeItemFromCart, clearCart, updateCartItem } from "@/utils/apis/cartAPI"
import { useUser } from "@/context/userContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addOrder } from "@/utils/apis/ordersAPI";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { useShallow } from 'zustand/shallow';

interface CartItemType {
  cart_id: string;
  cart_item_id: string;
  product_id: string;
  title: string;
  image: string;
  quantity: number;
  cost: number;
}

// export type CartItemType = (typeof cartData)[number];
export default function Cart() {
  const user = useUser();
  // console.log("User in cart is ", user)
  const router = useRouter();


  const { data: cartData, error } = useQuery({
    queryKey: ["cart", user?.user?.id],
    queryFn: () => user?.user?.id ? fetchCart(user.user.id) : Promise.resolve(undefined),
    enabled: !!user?.user?.id, // only run when user is available
  });

  // console.log("Cart data is ", cartData)

  const queryClient = useQueryClient();

  const { count, addCart, clearStoreCart, removeCart } = useCart(
    useShallow((state) => ({
      count: state.count,
      addCart: state.addCart,
      clearStoreCart: state.clearStoreCart,
      removeCart: state.removeCart,
    }))
  );

  const handleUpdateCart = async (id: string, quantity: number, product_id: string) => {
    await updateCartItemMutation.mutateAsync({ cart_item_id: id, quantity });
    if (quantity > 0) {
      addCart({ id: product_id, quantity: 1 });
    }
    else {
      removeCart(product_id);
    }
  }

  const handleRemoveItem = async (id: string, product_id: string) => {
    await removeItemFromCartMutation.mutateAsync(id);
    removeCart(product_id);
  }

  const handleClearCart = async (cart_id: string) => {
    await clearCartMutation.mutateAsync(cart_id); // clear backend
    clearStoreCart(); // clear Zustand store
  };

  const removeItemFromCartMutation = useMutation({
    mutationFn: (cart_item_id: string) =>
      removeItemFromCart(cart_item_id),
    onSuccess: () => {
      // console.log("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart", user?.user?.id] });
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: (cart_id: string) => clearCart(cart_id),
    onSuccess: () => {
      // console.log("Cart cleared");
      queryClient.invalidateQueries({ queryKey: ["cart", user?.user?.id] });
    }
  });

  const updateCartItemMutation = useMutation({
    mutationFn: (data: { cart_item_id: string, quantity: number }) => {
      console.log("MutationFn called with: ", data);
      return updateCartItem(data.cart_item_id, data.quantity);
    },
    onSuccess: () => {
      console.log("Item quantity updated");
      queryClient.invalidateQueries({ queryKey: ["cart", user?.user?.id] });
    }
  });

  const addOrderMutation = useMutation({
    mutationFn: (data: { cart_id: string }) => {
      console.log("AddOrder MutationFn called with: ", data);
      if (!user?.user?.id) throw new Error("User ID is required to add order");
      return addOrder(user.user.id, data.cart_id, subtotal, tax, total);
    },
    onSuccess: () => {
      router.push("/order-confirmation");
      console.log("Order item added");
      queryClient.invalidateQueries({ queryKey: ["cart", user?.user?.id] });
    }
  });

  const subtotal = cartData?.data?.reduce((sum: number, item: CartItemType) => sum + item.cost * item.quantity, 0) ?? 0;
  const delivery = 29.99;
  const tax = (subtotal * 18) / 100;
  const discount = 0
  // for (const item of cartData?.data){
  //   discount = discount + (item.original_price - item.price)
  // }
  const total = subtotal + tax + delivery - discount

  // if (isLoading) return <Progress />;
  if (error) return <div>Sorry, there was an error fetching the cart</div>;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-card border-cart-border rounded-lg border p-6">
              <h1 className="mb-6 text-2xl font-semibold">Shopping Cart</h1>
              {
                count > 0 && (
                  <h3 className="text-lg font-medium">Items in your cart: {count}</h3>
                )
              }
              <div className="space-y-4">
                {
                  cartData?.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                      <h2 className="text-lg font-medium">Your cart is empty</h2>
                      <Link href="/home">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  )
                }
                {cartData?.data.map((item: CartItemType) => (
                  <CartItem
                    key={item.cart_item_id}
                    {...item}
                    onUpdateQuantity={(id, qty) => handleUpdateCart(id, qty, item.product_id)}
                    onRemove={() => handleRemoveItem(item.cart_item_id, item.product_id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {
              cartData?.data.length == 0 ?
                <OrderSummary subtotal={subtotal} discount={discount} delivery={0} tax={tax} /> :
                <OrderSummary subtotal={subtotal} discount={discount} delivery={delivery} tax={tax} />
            }
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => {
                  addOrderMutation.mutate({ cart_id: cartData?.data[0]?.cart_id });
                }}
                disabled={cartData?.data.length === 0}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-full"
              >
                Purchase
              </Button>
              <Button
                onClick={() => handleClearCart(cartData?.data[0]?.cart_id)}
                variant="destructive"
                disabled={cartData?.data.length === 0}
                className="bg-destructive hover:bg-destructive/90 text-primary-foreground h-12 w-full"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
