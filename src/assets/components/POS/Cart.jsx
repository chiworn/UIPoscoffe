import React from "react";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  X
} from "lucide-react";

// ======================
// Empty Cart
// ======================
const CartEmpty = () => (
  <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-8">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
      <ShoppingCart className="h-8 w-8 text-gray-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">Cart is empty</h3>
    <p className="mt-1 text-sm text-gray-500">
      Add products to start an order
    </p>
  </div>
);

// ======================
// Cart Header
// ======================
const CartHeader = ({ itemCount, onClear }) => (
  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
    <div className="flex items-center gap-2">
      <h2 className="font-semibold text-gray-900">Current Order</h2>
      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
        {itemCount} items
      </span>
    </div>
    <button
      onClick={onClear}
      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-100 hover:text-red-600"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  </div>
);

// ======================
// Cart Item
// ======================
const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
    <div className="flex-1 min-w-0">
      <h4 className="truncate font-medium">
        {item.product.name}
      </h4>
      <p className="text-sm text-gray-500">
        {item.product.price.toLocaleString()}៛ × {item.quantity}
      </p>
    </div>

    <div className="flex items-center gap-1">
      <button
        onClick={() =>
          onUpdateQuantity(item.product.id, item.quantity - 1)
        }
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span className="w-8 text-center font-mono font-semibold">
        {item.quantity}
      </span>

      <button
        onClick={() =>
          onUpdateQuantity(item.product.id, item.quantity + 1)
        }
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>

    <div className="w-20 text-right font-mono font-bold">
      {(item.product.price * item.quantity).toLocaleString()}៛
    </div>

    <button
      onClick={() => onRemove(item.product.id)}
      className="flex h-7 w-7 items-center justify-center text-red-500"
    >
     <Trash2 className="h-5 w-5" />
    </button>
  </div>
);

// ======================
// Cart Items List
// ======================
const CartItems = ({ items, onUpdateQuantity, onRemove }) => (
  <div className="flex-1 space-y-3 overflow-y-auto p-4">
    {items.map((item) => (
      <CartItem
        key={item.product.id}
        item={item}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />
    ))}
  </div>
);

// ======================
// Cart Footer
// ======================
const CartFooter = ({ subtotal, onCheckout }) => (
  <div className="border-t border-gray-200 p-4">
    <div className="mb-4 flex justify-between">
      <span className="text-lg font-semibold">Total</span>
      <span className="text-2xl font-mono font-bold text-blue-600">
        {subtotal.toLocaleString()}៛
      </span>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => onCheckout("cash")}
        className="h-14 rounded-xl bg-gray-100 font-semibold"
      >
        Cash
      </button>
      <button
        onClick={() => onCheckout("qr")}
        className="h-14 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-white"
      >
        KHQR
      </button>
    </div>
  </div>
);

// ======================
// Main Cart Component
// ======================
export default function Cart({
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
  onCheckout
}) {
  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (items.length === 0) return <CartEmpty />;

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-white shadow-md">
      <CartHeader itemCount={itemCount} onClear={onClear} />
      <CartItems
        items={items}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />
      <CartFooter
        subtotal={subtotal}
        onCheckout={onCheckout}
      />
    </div>
  );
}
