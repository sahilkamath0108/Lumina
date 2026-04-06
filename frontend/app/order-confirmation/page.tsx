"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { fetchOrderItems, fetchOrder } from "@/utils/apis/ordersAPI"
import { useUser } from "@/context/userContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { clearCart } from "@/utils/apis/cartAPI"
import { CatalogVisualPlaceholder } from "@/components/catalog-visual-placeholder"

interface OrderItem {
  order_item_id: string,
  product_id: string,
  image: string,
  title: string,
  quantity: number,
  cost: number
}

export default function OrderConfirmation() {
  const user = useUser();

  const { data: orderItems, error: itemsError } = useQuery({
    queryKey: ["orderItems", user?.user?.id],
    queryFn: () => {
      if (!user?.user?.id) return Promise.resolve(undefined);
      return fetchOrderItems(user.user.id);
    },
    enabled: !!user?.user?.id,
  });

  const { data: orderDetails, error: detailsError } = useQuery({
    queryKey: ["orderDetails", user?.user?.id],
    queryFn: () => {
      if (!user?.user?.id) return Promise.resolve(undefined);
      return fetchOrder(user.user.id);
    },
    enabled: !!user?.user?.id,
  });

  const queryClient = useQueryClient();
  const clearCartMutation = useMutation({
    mutationFn: (cart_id: string) => clearCart(cart_id),
    onSuccess: () => {
      // console.log("Cart cleared");
      queryClient.invalidateQueries({ queryKey: ["cart", user?.user?.id] });
    }
  });

  // if (itemsLoading || detailsLoading) return <Progress />;
  if (itemsError || detailsError) return <div>Sorry, there was an error fetching the order</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
      <Card className="w-full max-w-xl py-0">
        <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Registration confirmed</CardTitle>
              <CardDescription className="text-sm">You&apos;re checked in — see you at Lumina.</CardDescription>
            </div>
            <CircleCheckIcon className="w-10 h-10" />
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <div className="font-medium">Registration details</div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Confirmation #</span>
                  <span>{orderDetails?.data.order_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date(orderDetails?.data.created_at).toLocaleString()}
</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="font-medium">Sessions on this pass</div>
              <div className="grid gap-3">
                {
                  orderItems?.data.map((item: OrderItem) => {
                    return (
                      <div key={item.order_item_id || item.product_id} 
                      className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CatalogVisualPlaceholder className="h-12 w-12 rounded-md" iconClassName="h-5 w-5" />
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-medium">₹ {item.cost}</div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="font-medium">Order Summary</div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{orderDetails?.data.subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>₹ 100.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{orderDetails?.data.tax}</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>{orderDetails?.data.total}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-muted/50 p-6 rounded-b-lg">
          <Link
            onClick={() => clearCartMutation.mutate(orderDetails?.data.cart_id)}
            href="/home"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary/50"
            prefetch={false}
          >
            Back to catalog
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

function CircleCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}