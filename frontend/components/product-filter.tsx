"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useProductStore } from "./store";

const categories = [
  { id: "all", label: "All tracks", icon: "🎪" },
  { id: "phones", label: "Mainstage", icon: "🎤" },
  { id: "headsets", label: "Architecture", icon: "🏗️" },
  { id: "laptops", label: "Hands-on labs", icon: "🧪" },
  { id: "tv", label: "Panels", icon: "🗣️" },
  { id: "sound", label: "Lightning talks", icon: "⚡" },
  { id: "watches", label: "Community", icon: "🤝" },
];

const brands = [
  { id: "apple", label: "Northwind Labs" },
  { id: "samsung", label: "Vertex Systems" },
  { id: "oneplus", label: "OpenRelay" },
  { id: "microsoft", label: "CloudForge" },
  { id: "sony", label: "Signal House" },
  { id: "bose", label: "Pulse Audio" },
  { id: "dell", label: "IronGrid" },
  { id: "lg", label: "Prism Works" },
  { id: "jbl", label: "Echo Stage" },
];

const colors = [
  { id: "red", label: "Red", color: "bg-red-500" },
  { id: "blue", label: "Blue", color: "bg-blue-500" },
  { id: "black", label: "Black", color: "bg-black" },
  { id: "white", label: "White", color: "bg-white border" },
  { id: "gray", label: "Gray", color: "bg-gray-600" }
];

// Filter component for reuse in both desktop and mobile
function FilterSection() {
  const {
    priceRange,
    selectedBrands,
    selectedColors,
    // deliveryDate,
    selectedCategory, // Added selectedCategory
    setPriceRange,
    toggleBrand,
    toggleColor,
    // setDeliveryDate,
    setSelectedCategory // Added setSelectedCategory
  } = useProductStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold">Conference tracks</h3>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="space-y-2 text-sm">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="cursor-pointer text-sm font-normal">
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Host orgs — filter ids still match `brand` values stored for each session */}
      <div>
        <h3 className="mb-3 font-semibold">Hosts & partners</h3>
        <div className="max-h-48 space-y-3 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => toggleBrand(brand.id)}
              />
              <Label htmlFor={`brand-${brand.id}`} className="cursor-pointer text-sm font-normal">
                {brand.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Accent tags */}
      <div>
        <h3 className="mb-3 font-semibold">Session accents</h3>
        <div className="grid grid-cols-1 gap-2">
          {colors.map((color) => (
            <div key={color.id} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.id}`}
                checked={selectedColors.includes(color.id)}
                onCheckedChange={() => toggleColor(color.id)}
              />
              <div className={`h-4 w-4 rounded ${color.color}`} />
              <Label htmlFor={`color-${color.id}`} className="cursor-pointer text-sm font-normal">
                {color.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-semibold">Pass price (₹)</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={3000}
            step={10}
            className="w-full"
          />
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Label htmlFor="price-from" className="text-muted-foreground text-xs">
                From
              </Label>
              <Input
                id="price-from"
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="h-8"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="price-to" className="text-muted-foreground text-xs">
                To
              </Label>
              <Input
                id="price-to"
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 3000])
                }
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterSection;