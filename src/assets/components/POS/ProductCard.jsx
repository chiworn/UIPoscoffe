import React from "react";
import { Coffee, CupSoda, Cookie, Soup, Plus , CakeSlice} from "lucide-react";

export default function ProductCard({ product, onAdd }) {
  const stock = Number(product.stock);
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 10;

  return (
    <button
      onClick={() => !isOutOfStock && onAdd(product)}
      disabled={isOutOfStock}
      className={`
        group relative flex flex-col rounded-xl border bg-white overflow-hidden
        transition-all duration-200 text-left
        hover:shadow-lg hover:-translate-y-0.5
        active:scale-[0.98]
        ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {/* IMAGE */}
      <div className="relative h-32 w-full bg-gray-100">
        <img
          src={product.image}
          alt={product.product_nameenglish}
          className="h-full w-full object-cover"
        />

        {/* CATEGORY ICON */}
        <div className="absolute top-2 right-2 rounded-full bg-white/80 p-1">
          {product.category?.category_name === "coffee" && <Coffee className="h-4 w-4" />}
          {product.category?.category_name === "drink" && <CupSoda className="h-4 w-4" />}
          {product.category?.category_name === "snacks" && <Cookie className="h-4 w-4" />}
          {product.category?.category_name === "food" && <Soup className="h-4 w-4" />}
           {product.category?.category_name === "dessert" && <CakeSlice className="h-4 w-4" />}
        </div>

        {/* STOCK BADGE */}
        {isLowStock && (
          <span className="absolute top-2 left-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
            Low: {stock}
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
            Out
          </span>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="flex flex-col flex-1 p-3">
        <h3 className="font-semibold text-gray-900 truncate">
          {product.product_nameenglish}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {product.product_namekhmer}
        </p>

        {/* PRICE + ADD */}
        <div className="mt-auto flex items-center justify-between">
          <span className="font-mono text-lg font-bold text-stone-600">
            {Number(product.price).toLocaleString()}៛
          </span>

          {!isOutOfStock && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition-all group-hover:bg-stone-700 group-hover:text-white">
              <Plus className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
