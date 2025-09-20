import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

const getToken = (getState: () => RootState) => {
  const { user } = getState();
  return user.userInfo?.token;
};

// Interface for a single review
interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

// SEO Interface
interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  altText?: string;
}

// The complete Product interface with all new fields
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  isSale?: boolean;
  salePrice?: number;
  category: string;
  planType: string;
  plotSize?: string;
  plotArea?: number;
  rooms?: number;
  bathrooms?: number;
  kitchen?: number;
  floors?: number;
  direction?: string;
  country?: string[];
  propertyType?: string;
  mainImage?: string;
  planFile?: string | string[];
  galleryImages?: string[];
  youtubeLink?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
  reviews?: Review[];
  rating?: number;
  numReviews?: number;
  seo?: SeoData;
  taxRate?: number;
  discountPercentage?: number;
  crossSellProducts?: Product[];
  upSellProducts?: Product[];
  [key: string]: any;
}

// Shape of the API response for fetchProducts
interface FetchProductsResponse {
  products: Product[];
  pagination?: any;
}

// Shape of the Redux state for this slice
interface ProductState {
  products: Product[];
  product: Product | null;
  pagination: any;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: ProductState = {
  products: [],
  product: null,
  pagination: null,
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

// --- ASYNC THUNKS ---

export const fetchProducts = createAsyncThunk<
  FetchProductsResponse,
  Record<string, any>,
  { rejectValue: string }
>("products/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_URL, { params });
    return {
      products: Array.isArray(data) ? data : data.products || [],
      pagination: data.pagination || null,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchById", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/${productId}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Product not found"
    );
  }
});

export const createProduct = createAsyncThunk<
  Product,
  FormData,
  { state: RootState; rejectValue: string }
>("products/create", async (productData, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(API_URL, productData, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create product"
    );
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { productId: string; productData: FormData },
  { state: RootState; rejectValue: string }
>(
  "products/update",
  async ({ productId, productData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/${productId}`,
        productData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("products/delete", async (productId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${productId}`, config);
    return productId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete product"
    );
  }
});

export const createReview = createAsyncThunk<
  { message: string },
  { productId: string; reviewData: { rating: number; comment: string } },
  { state: RootState; rejectValue: string }
>(
  "products/createReview",
  async ({ productId, reviewData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${API_URL}/${productId}/reviews`,
        reviewData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit review"
      );
    }
  }
);

// --- SLICE DEFINITION ---
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.product = null;
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const actionPending = (state: ProductState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (state: ProductState, action: AnyAction) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    builder.addCase(fetchProducts.pending, (state) => {
      state.listStatus = "loading";
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<FetchProductsResponse>) => {
        state.listStatus = "succeeded";
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action: AnyAction) => {
      state.listStatus = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchProductById.pending, (state) => {
      state.listStatus = "loading";
    });
    builder.addCase(
      fetchProductById.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.listStatus = "succeeded";
        state.product = action.payload;
      }
    );
    builder.addCase(fetchProductById.rejected, (state, action: AnyAction) => {
      state.listStatus = "failed";
      state.error = action.payload;
    });

    builder
      .addCase(createProduct.pending, actionPending)
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.actionStatus = "succeeded";
          state.products.unshift(action.payload);
        }
      )
      .addCase(createProduct.rejected, actionRejected);
    builder
      .addCase(updateProduct.pending, actionPending)
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.actionStatus = "succeeded";
          state.products = state.products.map((p) =>
            p._id === action.payload._id ? action.payload : p
          );
          if (state.product?._id === action.payload._id) {
            state.product = action.payload;
          }
        }
      )
      .addCase(updateProduct.rejected, actionRejected);
    builder
      .addCase(deleteProduct.pending, actionPending)
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.products = state.products.filter(
            (p) => p._id !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, actionRejected);
    builder
      .addCase(createReview.pending, actionPending)
      .addCase(createReview.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(createReview.rejected, actionRejected);
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
