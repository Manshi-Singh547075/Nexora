import { useState, useEffect } from "react";
import axios from "axios";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import { ShoppingCart, Store } from "lucide-react"; // 🛒 Icons

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

      // Recreate item with new quantity
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
    <div className="min-h-screen bg-linear-gradient- from-gray-500 to-gray-100">
      <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => setShowCart(false)}
          >
            <Store className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Vibe <span className="text-blue-600">Commerce</span>
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Shop your vibe. Feel your style ✨
              </p>
            </div>
          </div>

          {/* Cart Button */}
          {!showCart && (
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-3 shadow-lg transition-all duration-200 hover:shadow-blue-300/50"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>View Cart</span>

              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow">
                  {cartItems.length}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

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

      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
