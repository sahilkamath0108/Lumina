import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CatalogVisualPlaceholder } from "@/components/catalog-visual-placeholder";

interface CartItemProps {
  cart_id: string;
  cart_item_id: string;
  product_id: string;
  title: string;
  image: string;
  quantity: number;
  cost: number;
  onUpdateQuantity: (id: string, quantity: number) => string | void | Promise<string | void>;
  onRemove: (id: string) => void;
}

export const CartItem = ({
  cart_item_id,
  product_id,
  title,
  cost,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const router = useRouter();

  return (
    <div className="bg-cart-item border-cart-border flex w-full items-center justify-between gap-4 rounded-lg border p-4">
      <div
        className="flex min-w-0 cursor-pointer items-center gap-4"
        onClick={() => router.push(`/session/${product_id}`)}
      >
        <CatalogVisualPlaceholder className="h-16 w-16 flex-shrink-0 rounded-lg" iconClassName="h-6 w-6" />
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground line-clamp-2 text-sm font-medium lg:text-base">{title}</h3>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-cart-quantity flex items-center gap-2 rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted h-8 w-8"
            onClick={() => onUpdateQuantity(cart_item_id, Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-[2rem] text-center text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted h-8 w-8"
            onClick={() => onUpdateQuantity(cart_item_id, quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-cart-price min-w-[80px] text-right text-sm font-semibold lg:text-base">
          ₹{(cost * quantity).toFixed(2)}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
          onClick={() => onRemove(cart_item_id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
