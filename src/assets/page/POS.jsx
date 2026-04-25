import React, { useState, useMemo,useEffect } from "react";
import Cart from "../components/POS/Cart";
import CategoryTabs from "../components/POS/CategoryTabs";
import ProductCard from "../components/POS/ProductCard.jsx";
import api from "../../api/axios";

// Simple toast function
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white ${
    type === 'success' ? 'bg-green-600' : 'bg-blue-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};
// Main POS Component
const POS = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category = product.category?.category_name?.trim().toLowerCase();
      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;

      const matchesSearch =
        product.product_nameenglish?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.product_namekhmer?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      console.log("API data:", res.data.datas); 
      setProducts(res.data.datas);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`${product.product_nameenglish} added - ${Number(product.price).toLocaleString()}៛`);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    showToast('Cart cleared', 'info');
  };
  const handleCheckout = async (method) => {
  if (cart.length === 0) {
    showToast("Cart is empty ❌");
    return;
  }
  try {

   const itemPromises = cart.map(item => 
      api.post("/itemorders", {
        product_id: item.product.id,
        total_qty: item.quantity,
        total_amount: item.product.price * item.quantity,
        payment_method: method === "qr" ? "KHQR" : "Cash",
      })
    );
    const itemResponses = await Promise.all(itemPromises);
    const itemIds = itemResponses.map(res => res.data.id);

    console.log("ID items:", itemIds);
    const total = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    
    const cashierId = localStorage.getItem("ID");
    
     await api.post("/saller", {
      cashier_id: cashierId || 1, 
      items_id: itemIds,
    });

    // Show toast
    showToast(
      `Order completed! Total: ${total.toLocaleString()}៛ via ${
        method === "qr" ? "KHQR" : "Cash"
      }`
    );

    // Optional: clear cart
    setCart([]);

  }catch (error) {
    console.error(error);
    showToast("Failed to save order ❌");
  }
};

  return (
    <div className=" bg-gray-50">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Products Section */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-6">
          {/* Search */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categories */}
            <CategoryTabs
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

          {/* Products Grid */}
          <div className="mt-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
             {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                />
              ))}

            </div>
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium text-gray-900">No products found</p>
                <p className="text-sm text-gray-500">Try a different search or category</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="hidden w-96 border-l border-gray-200 bg-gray-50 p-4 lg:block">
          <Cart
            items={cart}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onClear={clearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Mobile Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 lg:hidden">
          <button
            onClick={() => handleCheckout('cash')}
            className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
              <span className="font-semibold">View Cart</span>
            </div>
            <span className="font-mono text-lg font-bold">
              {cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString()}៛
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default POS;