import { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
} from "lucide-react";

export default function Cart({
  cartItems,
  cartTotal,
  onRemove,
  onCheckout,
  onContinueShopping,
  onCartChange,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [localCartItems, setLocalCartItems] = useState(cartItems);

  // Update local state when cartItems prop changes
  useState(() => {
    setLocalCartItems(cartItems);
  }, [cartItems]);

  const getTotalItems = () =>
    localCartItems.reduce((total, item) => total + item.qty, 0);

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemove(id);
      return;
    }

    try {
      setIsLoading(true);

      // Update local state immediately for better UX
      setLocalCartItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, qty: newQuantity } : item
        )
      );

      await axios.put(`http://localhost:5000/api/cart/update/${id}`, {
        qty: newQuantity,
      });

      // Refresh cart to ensure sync with backend
      await onCartChange();
    } catch (err) {
      console.error("Error updating qty:", err);
      // Revert local state if API call fails
      await onCartChange();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      setIsLoading(true);
      
      // Update local state immediately
      setLocalCartItems(prevItems => 
        prevItems.filter(item => item._id !== id)
      );

      await onRemove(id);
      await onCartChange();
    } catch (err) {
      console.error("Error removing item:", err);
      // Revert local state if API call fails
      await onCartChange();
    } finally {
      setIsLoading(false);
    }
  };

  if (!localCartItems) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-light text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} in your
            cart
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="text-gray-600 hover:text-gray-900 flex items-center space-x-2 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {localCartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ShoppingCart className="mx-auto text-gray-300 w-20 h-20 mb-6" />
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <button
            onClick={onContinueShopping}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {localCartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start space-x-6">
                  {/* Product Image */}
                  <div className="shrink-0 w-24 h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                    {item.productId.image ? (
                      <img
                        src={item.productId.image}
                        alt={item.productId.name}
                        className="w-20 h-20 object-contain"
                      />
                    ) : (
                      <ShoppingCart className="text-gray-300 w-8 h-8" />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {item.productId.name}
                    </h3>
                    <p className="text-2xl font-light text-gray-900 mb-4">
                      ${item.productId.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700">
                        Quantity:
                      </span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.qty - 1)
                          }
                          disabled={isLoading}
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>

                        <span className="text-lg font-medium text-gray-900 min-w-12 text-center">
                          {item.qty}
                        </span>

                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.qty + 1)
                          }
                          disabled={isLoading}
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="flex flex-col items-end space-y-4">
                    <p className="text-2xl font-medium text-gray-900">
                      ${(item.productId.price * item.qty).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={isLoading}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ---------- 💳 Order Summary ---------- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({getTotalItems()})</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-xl">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="text-3xl font-light text-gray-900">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Proceed to Checkout`
                )}
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Secure checkout · No payment required
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}