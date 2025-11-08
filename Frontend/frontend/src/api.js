import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const getProducts = () => axios.get(`${API_BASE}/products`);
export const getCart = () => axios.get(`${API_BASE}/cart`);
export const addToCart = (productId, qty) => axios.post(`${API_BASE}/cart`, { productId, qty });
export const removeFromCart = (id) => axios.delete(`${API_BASE}/cart/${id}`);
export const checkout = (cartItems, name, email) =>
  axios.post(`${API_BASE}/checkout`, { cartItems, name, email });
