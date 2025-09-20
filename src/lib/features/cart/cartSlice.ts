import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/cart`;

// Helper to get auth token from the user state
const getToken = (state: RootState) => {
  const { user } = state;
  return user.userInfo?.token;
};

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: CartState = {
  items: [],
  total: 0,
  status: "idle",
  error: null,
};

// --- Async Thunks for API Calls ---

export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState }
>("cart/fetchCart", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    if (!token) return [];
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data.items || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch cart"
    );
  }
});

export const addItemToCart = createAsyncThunk<
  CartItem[],
  any,
  { state: RootState }
>("cart/addItem", async (itemData, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(API_URL, itemData, config);
    return data.items;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add item to cart"
    );
  }
});

export const updateCartItemQuantity = createAsyncThunk<
  CartItem[],
  { productId: string; quantity: number },
  { state: RootState }
>(
  "cart/updateQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = getToken(state);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        API_URL,
        { productId, quantity },
        config
      );
      return data.items;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

export const removeCartItem = createAsyncThunk<
  CartItem[],
  string,
  { state: RootState }
>("cart/removeItem", async (productId, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete(`${API_URL}/${productId}`, config);
    return data.items;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to remove item from cart"
    );
  }
});

// ✨ NEW THUNK TO CLEAR THE CART IN THE DATABASE ✨
export const clearCartDB = createAsyncThunk<void, void, { state: RootState }>(
  "cart/clearCartDB",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = getToken(state);
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(API_URL, config);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    const handleFulfilled = (
      state: CartState,
      action: PayloadAction<CartItem[]>
    ) => {
      state.status = "succeeded";
      state.items = action.payload;
      state.total = action.payload.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    };
    const handlePending = (state: CartState) => {
      state.status = "loading";
    };
    const handleRejected = (state: CartState, action: AnyAction) => {
      state.status = "failed";
      state.error = action.payload;
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addItemToCart.pending, handlePending)
      .addCase(addItemToCart.fulfilled, handleFulfilled)
      .addCase(addItemToCart.rejected, handleRejected)
      .addCase(updateCartItemQuantity.pending, handlePending)
      .addCase(updateCartItemQuantity.fulfilled, handleFulfilled)
      .addCase(updateCartItemQuantity.rejected, handleRejected)
      .addCase(removeCartItem.pending, handlePending)
      .addCase(removeCartItem.fulfilled, handleFulfilled)
      .addCase(removeCartItem.rejected, handleRejected)
      // Add case for the new thunk
      .addCase(clearCartDB.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.status = "succeeded";
      });
  },
});
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
