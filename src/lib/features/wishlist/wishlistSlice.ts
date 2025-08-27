import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`;

// Helper to get auth token from the user state
const getToken = (state: RootState) => {
  const { user } = state;
  return user.userInfo?.token;
};

interface Product {
  id: string;
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  size?: string;
}

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  size?: string;
}

interface WishlistState {
  items: WishlistItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: WishlistState = {
  items: [],
  status: "idle",
  error: null,
};

// --- Async Thunks for API Calls ---

export const fetchWishlist = createAsyncThunk<
  WishlistItem[],
  void,
  { state: RootState }
>("wishlist/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    if (!token) return [];
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data.items || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch wishlist"
    );
  }
});

export const addToWishlist = createAsyncThunk<
  WishlistItem[],
  Product,
  { state: RootState }
>("wishlist/add", async (product, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(
      API_URL + "/add",
      { productId: product._id || product.id },
      config
    );
    return data.items;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add to wishlist"
    );
  }
});

export const removeFromWishlist = createAsyncThunk<
  WishlistItem[],
  string,
  { state: RootState }
>("wishlist/remove", async (productId, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete(
      `${API_URL}/remove/${productId}`,
      config
    );
    return data.items;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to remove from wishlist"
    );
  }
});

export const mergeWishlist = createAsyncThunk<
  WishlistItem[],
  Product[],
  { state: RootState }
>("wishlist/merge", async (localItems, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(
      `${API_URL}/merge`,
      { localWishlistItems: localItems },
      config
    );
    return data.items;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to merge wishlist"
    );
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setLocalWishlist: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload.map((p) => ({
        productId: p.id,
        name: p.name,
        price: p.price,
        salePrice: p.salePrice,
        image: p.image,
        size: p.size,
      }));
    },
    clearWishlist: (state) => {
      state.items = [];
      state.status = "idle";
    },
    // Optional: Remove item immediately for local wishlist UX
    removeItemImmediately: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: WishlistState) => {
      state.status = "loading";
    };
    const handleRejected = (state: WishlistState, action: AnyAction) => {
      state.status = "failed";
      state.error = action.payload;
    };
    const handleFulfilled = (
      state: WishlistState,
      action: PayloadAction<WishlistItem[]>
    ) => {
      state.status = "succeeded";
      state.items = action.payload;
    };

    builder
      .addCase(fetchWishlist.pending, handlePending)
      .addCase(fetchWishlist.fulfilled, handleFulfilled)
      .addCase(fetchWishlist.rejected, handleRejected);
    builder
      .addCase(addToWishlist.pending, handlePending)
      .addCase(addToWishlist.fulfilled, handleFulfilled)
      .addCase(addToWishlist.rejected, handleRejected);
    builder
      .addCase(removeFromWishlist.pending, handlePending)
      .addCase(removeFromWishlist.fulfilled, handleFulfilled)
      .addCase(removeFromWishlist.rejected, handleRejected);
    builder
      .addCase(mergeWishlist.pending, handlePending)
      .addCase(mergeWishlist.fulfilled, handleFulfilled)
      .addCase(mergeWishlist.rejected, handleRejected);
  },
});

export const { clearWishlist, setLocalWishlist, removeItemImmediately } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
