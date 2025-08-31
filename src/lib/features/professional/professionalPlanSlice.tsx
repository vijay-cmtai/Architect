import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/professional-plans`;

const getToken = (state: RootState) => {
  const { user } = state;
  let token =
    user.userInfo?.token ||
    user.userInfo?.accessToken ||
    user.userInfo?.data?.token;
  return token;
};

// ++ CHANGE HERE: Added an interface for a single review
interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

interface Plan {
  _id: string;
  planName: string;
  mainImage: string;
  price: number;
  salePrice?: number;
  isSale?: boolean;
  plotSize: string;
  plotArea: number;
  rooms: number;
  bathrooms: number;
  kitchen: number;
  category: string;
  direction: string;
  floors: number;
  propertyType: string;
  // ++ CHANGE HERE: Added the reviews array, rating, and numReviews to the Plan interface
  reviews?: Review[];
  rating?: number;
  numReviews?: number;
  [key: string]: any;
}

interface ProfessionalPlanState {
  plans: Plan[];
  plan: Plan | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: ProfessionalPlanState = {
  plans: [],
  plan: null,
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

// --- ASYNC THUNKS ---

export const fetchAllApprovedPlans = createAsyncThunk<
  Plan[],
  void,
  { rejectValue: string }
>("professionalPlans/fetchAllApproved", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_URL);
    return Array.isArray(data) ? data : data.plans || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch approved plans"
    );
  }
});

export const fetchMyPlans = createAsyncThunk<
  Plan[],
  void,
  { state: RootState }
>("professionalPlans/fetchMy", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    if (!token)
      return rejectWithValue(
        "No authentication token found. Please log in again."
      );
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/my-plans`, config);
    return Array.isArray(data) ? data : data.plans || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch your plans"
    );
  }
});

export const fetchPlanById = createAsyncThunk<
  Plan,
  string,
  { rejectValue: string }
>("professionalPlans/fetchById", async (planId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/${planId}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Plan not found");
  }
});

export const createPlan = createAsyncThunk<
  Plan,
  FormData,
  { state: RootState }
>(
  "professionalPlans/create",
  async (planData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = getToken(state);
      if (!token)
        return rejectWithValue(
          "No authentication token found. Please log in again."
        );
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(API_URL, planData, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create plan"
      );
    }
  }
);

export const updatePlan = createAsyncThunk<
  Plan,
  { planId: string; planData: FormData },
  { state: RootState }
>(
  "professionalPlans/update",
  async ({ planId, planData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = getToken(state);
      if (!token)
        return rejectWithValue(
          "No authentication token found. Please log in again."
        );
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/${planId}`,
        planData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update plan"
      );
    }
  }
);

export const deletePlan = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("professionalPlans/delete", async (planId, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    if (!token)
      return rejectWithValue(
        "No authentication token found. Please log in again."
      );
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${planId}`, config);
    return planId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete plan"
    );
  }
});

// ==========================================================
// ✨ NEW ASYNC THUNK FOR CREATING A PLAN REVIEW ✨
// ==========================================================
export const createPlanReview = createAsyncThunk<
  { message: string },
  { planId: string; reviewData: { rating: number; comment: string } },
  { state: RootState; rejectValue: string }
>(
  "professionalPlans/createReview",
  async ({ planId, reviewData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = getToken(state);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${API_URL}/${planId}/reviews`,
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

const professionalPlanSlice = createSlice({
  name: "professionalPlans",
  initialState,
  reducers: {
    resetPlanActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
    clearPlans: (state) => {
      state.plans = [];
      state.plan = null;
      state.listStatus = "idle";
      state.actionStatus = "idle";
      state.error = null;
    },
    resetPlanState: (state) => {
      state.plan = null;
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const actionPending = (state: ProfessionalPlanState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (
      state: ProfessionalPlanState,
      action: AnyAction
    ) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    // Fetch All Approved Plans
    builder
      .addCase(fetchAllApprovedPlans.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllApprovedPlans.fulfilled,
        (state, action: PayloadAction<Plan[]>) => {
          state.listStatus = "succeeded";
          state.plans = action.payload;
        }
      )
      .addCase(fetchAllApprovedPlans.rejected, (state, action: AnyAction) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    // Fetch My Plans
    builder
      .addCase(fetchMyPlans.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchMyPlans.fulfilled,
        (state, action: PayloadAction<Plan[]>) => {
          state.listStatus = "succeeded";
          state.plans = action.payload;
        }
      )
      .addCase(fetchMyPlans.rejected, (state, action: AnyAction) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    // Fetch Plan By ID
    builder
      .addCase(fetchPlanById.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchPlanById.fulfilled,
        (state, action: PayloadAction<Plan>) => {
          state.listStatus = "succeeded";
          state.plan = action.payload;
        }
      )
      .addCase(fetchPlanById.rejected, (state, action: AnyAction) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    // Create, Update, Delete Plan
    builder
      .addCase(createPlan.pending, actionPending)
      .addCase(createPlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.actionStatus = "succeeded";
        state.plans.unshift(action.payload);
      })
      .addCase(createPlan.rejected, actionRejected);

    builder
      .addCase(updatePlan.pending, actionPending)
      .addCase(updatePlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.actionStatus = "succeeded";
        state.plans = state.plans.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        if (state.plan && state.plan._id === action.payload._id) {
          state.plan = action.payload;
        }
      })
      .addCase(updatePlan.rejected, actionRejected);

    builder
      .addCase(deletePlan.pending, actionPending)
      .addCase(deletePlan.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionStatus = "succeeded";
        state.plans = state.plans.filter((p) => p._id !== action.payload);
        if (state.plan && state.plan._id === action.payload) {
          state.plan = null;
        }
      })
      .addCase(deletePlan.rejected, actionRejected);

    // ==========================================================
    // ✨ NEW EXTRA REDUCER FOR HANDLING PLAN REVIEW CREATION ✨
    // ==========================================================
    builder
      .addCase(createPlanReview.pending, actionPending)
      .addCase(createPlanReview.fulfilled, (state) => {
        state.actionStatus = "succeeded";
        // We don't need to manually update the state here.
        // It's better to refetch the plan data after a successful review to get the latest list.
      })
      .addCase(createPlanReview.rejected, actionRejected);
  },
});

export const { resetPlanActionStatus, clearPlans, resetPlanState } =
  professionalPlanSlice.actions;
export default professionalPlanSlice.reducer;
