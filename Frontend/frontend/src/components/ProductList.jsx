import { useEffect, useState } from "react";
import { getProducts } from "../api";
import { ShoppingBag, Sparkles } from "lucide-react";

export default function ProductLists({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* ---------- 🛍️ Header Section ---------- */}
      <div className="text-center mb-16">
       
        
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
          <span className="bg-linear-to-r from-gray-400 via-gray-500 to-gray-900 bg-clip-text text-transparent">
            Vibe
          </span>{" "}
          <span className="bg-linear-to-r from-blue-400 via-blue-500 to-purple-900 bg-clip-text text-transparent">
            Commerce
          </span>
        </h1>
        
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto font-light">
          Discover handpicked products that bring your everyday style to life ✨
        </p>
        
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(p => (
          <div
            key={p._id}
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500 overflow-hidden hover:-translate-y-2"
          >
            {/* Image Container with Gradient Overlay */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-8 overflow-hidden">
              {p.image ? (
                <>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 relative z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </>
              ) : (
                <div className="text-gray-300 text-5xl">🛒</div>
              )}
              
              {/* Floating badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <span className="text-xs font-bold text-blue-600">New</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                {p.name}
              </h3>

              <div className="flex items-center justify-between mt-5">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Price</p>
                  <span className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    ${p.price}
                  </span>
                </div>

                <button
                  onClick={() => onAddToCart(p)}
                  className="group/btn relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white pl-5 pr-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-300 flex items-center space-x-2 overflow-hidden"
                >
                  <ShoppingBag className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Add</span>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}