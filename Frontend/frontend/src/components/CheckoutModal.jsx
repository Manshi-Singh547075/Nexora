export default function CheckoutModal({ cartItems, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl w-96 shadow-2xl relative">
        <h2 className="text-2xl font-semibold mb-4 text-center">Checkout Summary</h2>
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {cartItems.map((item) => (
            <li
              key={item._id}
              className="flex justify-between border-b border-gray-200 pb-1"
            >
              <span>{item.productId.name}</span>
              <span>${item.productId.price * item.qty}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
