import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/users/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production", 
});
