import { useEffect, useState } from "react";
import { getProducts } from "../api";

export default function ProductLists({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ---------- 🛍️ Header Section ---------- */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Vibe <span className="text-blue-600">Commerce</span>
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Discover handpicked products that bring your everyday style to life ✨
        </p>
        <div className="mt-2 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* ---------- 🛒 Product Grid ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(p => (
          <div
            key={p._id}
            className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="aspect-square bg-gray-50 flex items-center justify-center p-6">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="text-gray-300 text-4xl">🛒</div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                {p.name}
              </h3>

              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-light text-gray-900">
                  ${p.price}
                </span>

                <button
                  onClick={() => onAddToCart(p)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-200 font-medium text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
