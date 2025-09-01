// lib/features/gallery/gallerySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/lib/store";

// Define la interfaz para un item de la galería
export interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  secure_url: string; // La URL de Cloudinary
  public_id: string;
  createdAt?: string;
}

// Define la interfaz para el estado del slice
interface GalleryState {
  items: GalleryItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed"; // Para acciones como crear/eliminar
  error: string | null;
}

const initialState: GalleryState = {
  items: [],
  status: "idle",
  actionStatus: "idle",
  error: null,
};

// --- THUNKS ASÍNCRONOS ---

// Thunk para obtener todos los items de la galería
export const fetchGalleryItems = createAsyncThunk(
  "gallery/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/gallery`
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Erroor cannot create gallery item"
      );
    }
  }
);

// Thunk para crear un nuevo item en la galería (subir imagen)
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
      const { data } = await axios.post("/api/gallery", formData, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error al subir la imagen"
      );
    }
  }
);

// Thunk para eliminar un item de la galería
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
      await axios.delete(`/api/gallery/${id}`, config);
      return id; // Devuelve el ID para poderlo eliminar del estado
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error can not upload image"
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
          state.items.unshift(action.payload); // Añade la nueva imagen al principio
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
