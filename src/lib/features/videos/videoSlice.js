// src/lib/features/videos/videoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to get token from state
const getToken = (getState) => {
  const { user } = getState();
  return user.userInfo?.token;
};

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/videos`;

// --- ASYNC THUNKS ---

// 1. Fetch all videos (can be filtered by topic)
export const fetchVideos = createAsyncThunk(
  "videos/fetchAll",
  async (topic = null, { rejectWithValue }) => {
    try {
      const params = topic ? { topic } : {};
      const { data } = await axios.get(API_URL, { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch videos"
      );
    }
  }
);

// 2. Fetch all unique topics
export const fetchTopics = createAsyncThunk(
  "videos/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/topics`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch topics"
      );
    }
  }
);

// 3. Upload a new video
export const addVideoLink = createAsyncThunk(
  // Renamed for clarity
  "videos/addLink",
  async ({ title, youtubeLink, topic }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Send title, youtubeLink, and topic in the request body
      const { data } = await axios.post(
        API_URL,
        { title, youtubeLink, topic },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add video link"
      );
    }
  }
);

// 4. Delete a video
export const deleteVideo = createAsyncThunk(
  "videos/delete",
  async (videoId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${videoId}`, config);
      return videoId; // Return the ID for removal from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete video"
      );
    }
  }
);

const initialState = {
  videos: [],
  topics: [],
  listStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  actionStatus: "idle", // For create/delete actions
  error: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Videos
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    // Fetch Topics
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    // Upload Video
    builder
      .addCase(addVideoLink.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(addVideoLink.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.videos.unshift(action.payload); // Add new video to the top
      })
      .addCase(addVideoLink.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });
    // Delete Video
    builder
      .addCase(deleteVideo.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.videos = state.videos.filter((v) => v._id !== action.payload);
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetActionStatus } = videoSlice.actions;
export default videoSlice.reducer;
