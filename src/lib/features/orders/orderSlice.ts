// lib/features/orders/orderSlice.js

import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/orders`;
const getToken = (state: RootState) => state.user.userInfo?.token;

interface Order {
  _id: string;
  [key: string]: any;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed"; // For actions like delete, update
  error: any;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  status: "idle",
  actionStatus: "idle",
  error: null,
};

// --- USER ASYNC THUNKS ---

export const createOrder = createAsyncThunk<Order, any, { state: RootState }>(
  "orders/create",
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = getToken(state);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(API_URL, orderData, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk<
  Order[],
  void,
  { state: RootState }
>("orders/fetchMyOrders", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/myorders`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch orders"
    );
  }
});

export const payOrderWithPaypal = createAsyncThunk<
  Order,
  { orderId: string; paymentResult: any },
  { state: RootState }
>(
  "orders/payWithPaypal",
  async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = getToken(state);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/${orderId}/pay-with-paypal`,
        paymentResult,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "PayPal payment update failed"
      );
    }
  }
);

// --- ADMIN ASYNC THUNKS ---

export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { state: RootState }
>("orders/fetchAllAdmin", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/all`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch all orders"
    );
  }
});

export const markOrderAsPaidAdmin = createAsyncThunk<
  Order,
  string,
  { state: RootState }
>("orders/markAsPaidAdmin", async (orderId, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.put(
      `${API_URL}/${orderId}/mark-as-paid`,
      {},
      config
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to mark order as paid"
    );
  }
});

export const deleteOrderAdmin = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("orders/deleteAdmin", async (orderId, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${orderId}`, config);
    return orderId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete order"
    );
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
      state.status = "idle";
    },
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const listPending = (state: OrderState) => {
      state.status = "loading";
      state.error = null;
    };
    const listRejected = (state: OrderState, action: AnyAction) => {
      state.status = "failed";
      state.error = action.payload;
    };
    const actionPending = (state: OrderState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (state: OrderState, action: AnyAction) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Fetch My Orders
    builder
      .addCase(fetchMyOrders.pending, listPending)
      .addCase(
        fetchMyOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
        }
      )
      .addCase(fetchMyOrders.rejected, listRejected);

    // Pay with Paypal
    builder
      .addCase(payOrderWithPaypal.pending, actionPending)
      .addCase(
        payOrderWithPaypal.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.actionStatus = "succeeded";
          const index = state.orders.findIndex(
            (o) => o._id === action.payload._id
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
        }
      )
      .addCase(payOrderWithPaypal.rejected, actionRejected);

    // --- ADMIN REDUCERS ---

    // Fetch All Orders (Admin)
    builder
      .addCase(fetchAllOrders.pending, listPending)
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
        }
      )
      .addCase(fetchAllOrders.rejected, listRejected);

    // Mark as Paid (Admin)
    builder
      .addCase(markOrderAsPaidAdmin.pending, actionPending)
      .addCase(
        markOrderAsPaidAdmin.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.actionStatus = "succeeded";
          state.orders = state.orders.map((order) =>
            order._id === action.payload._id ? action.payload : order
          );
        }
      )
      .addCase(markOrderAsPaidAdmin.rejected, actionRejected);

    // Delete Order (Admin)
    builder
      .addCase(deleteOrderAdmin.pending, actionPending)
      .addCase(
        deleteOrderAdmin.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.orders = state.orders.filter(
            (order) => order._id !== action.payload
          );
        }
      )
      .addCase(deleteOrderAdmin.rejected, actionRejected);
  },
});

export const { resetCurrentOrder, resetActionStatus } = orderSlice.actions;
export default orderSlice.reducer;
