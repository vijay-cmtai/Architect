import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/lib/store";

// Define the API URL base for this slice
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/gallery`;

// Define the interface for a gallery item
export interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  public_id: string; // <-- This is REQUIRED
  createdAt?: string;
}

// Define the interface for the slice's state
interface GalleryState {
  items: GalleryItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed"; // For actions like create/delete
  error: string | null;
}

const initialState: GalleryState = {
  items: [],
  status: "idle",
  actionStatus: "idle",
  error: null,
};

// --- ASYNC THUNKS ---

// Thunk to fetch all gallery items
export const fetchGalleryItems = createAsyncThunk(
  "gallery/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not fetch gallery items."
      );
    }
  }
);

// Thunk to create a new gallery item (upload image)
export const createGalleryItem = createAsyncThunk<GalleryItem, FormData>(
  "gallery/createItem",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as RootState;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.userInfo?.token}`,
        },
      };
      // FIX: Using the full API_URL, not a relative path
      const { data } = await axios.post(API_URL, formData, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload image."
      );
    }
  }
);

// Thunk to delete a gallery item
export const deleteGalleryItem = createAsyncThunk<string, string>(
  "gallery/deleteItem",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as RootState;
      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo?.token}`,
        },
      };
      // FIX: Using the full API_URL with the item ID, not a relative path
      await axios.delete(`${API_URL}/${id}`, config);
      return id; // Return the ID for removal from the state
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete image."
      );
    }
  }
);

// --- SLICE ---

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchGalleryItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchGalleryItems.fulfilled,
        (state, action: PayloadAction<GalleryItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchGalleryItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create
      .addCase(createGalleryItem.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(
        createGalleryItem.fulfilled,
        (state, action: PayloadAction<GalleryItem>) => {
          state.actionStatus = "succeeded";
          state.items.unshift(action.payload); // Add the new image to the beginning
        }
      )
      .addCase(createGalleryItem.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteGalleryItem.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(
        deleteGalleryItem.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.items = state.items.filter(
            (item) => item._id !== action.payload
          );
        }
      )
      .addCase(deleteGalleryItem.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetActionStatus } = gallerySlice.actions;
export default gallerySlice.reducer;
