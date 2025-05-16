import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type CartItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  images: string[];
};

type CartState = CartItem[];

const cartLocalStorage = JSON.parse(localStorage.getItem("cart") || "[]");

const initialState: CartState = cartLocalStorage;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const itemExists = state.find((item) => item.id === action.payload.id);
      if (itemExists) {
        toast.error("Item already in cart");
      } else {
        state.push({ ...action.payload, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify([...state]));
        toast.success("Added to cart");
      }
    },
    removeItem(state, action: PayloadAction<string | number>) {
      const newProducts = state.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify([...newProducts]));
      return newProducts;
    },
    buyItem() {
      localStorage.setItem("cart", JSON.stringify([]));
      return [];
    },
    clearCartItem() {
      localStorage.setItem("cart", JSON.stringify([]));
      return [];
    },
    increaseQuantity(state, action: PayloadAction<string | number>) {
      const item = state.find((item) => item.id == action.payload);
      if (item) {
        item.quantity += 1;
        localStorage.setItem("cart", JSON.stringify([...state]));
      }
    },
    decreaseQuantity(state, action: PayloadAction<string | number>) {
      const item = state.findIndex((item) => item.id == action.payload);
      if (item !== -1) {
        if (state[item].quantity > 1) {
          state[item].quantity -= 1;
        } else {
          state.splice(item, 1);
        }
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
  },
});

export default cartSlice.reducer;
export const {
  addToCart,
  removeItem,
  buyItem,
  clearCartItem,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;
