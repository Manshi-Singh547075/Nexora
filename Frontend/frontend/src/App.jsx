import { useState, useEffect } from "react";
import axios from "axios";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart");
      const data = res.data;
      setCartItems(data.items || []);
      setCartTotal(data.total || 0);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Centralized cart handlers
  const addToCart = async (product) => {
    try {
      await axios.post("http://localhost:5000/api/cart", {
        productId: product._id,
        quantity: 1,
      });
      await fetchCart();
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`);
      await fetchCart();
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity, productId) => {
    try {
      if (newQuantity < 1) return removeFromCart(cartItemId);

      // Some backends may not support PUT, so re-add the product
      await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`);
      await axios.post("http://localhost:5000/api/cart", {
        productId,
        quantity: newQuantity,
      });
      await fetchCart();
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => setShowCart(false)}>
            <h1 className="text-3xl font-bold text-gray-900">
              Vibe <span className="text-blue-600">Commerce</span>
            </h1>
            <p className="text-gray-500 text-sm">Shop your vibe. Feel your style ✨</p>
          </div>

          {!showCart && (
            <button
              onClick={() => setShowCart(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center space-x-3"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>View Cart</span>
              {cartItems.length > 0 && (
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* ---------- 🧩 Main Content ---------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {showCart ? (
          <Cart
            cartItems={cartItems}
            cartTotal={cartTotal}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onCheckout={handleCheckout}
            onContinueShopping={() => setShowCart(false)}
          />
        ) : (
          <ProductList onAddToCart={addToCart} />
        )}
      </main>

      {/* ---------- 💳 Checkout Modal ---------- */}
      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
