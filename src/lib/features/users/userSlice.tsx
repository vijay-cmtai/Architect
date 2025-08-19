
// import axios from "axios";

// // Local storage se user info get karein, agar pehle se login hai to
// const userInfoFromStorage = localStorage.getItem("userInfo")
//   ? JSON.parse(localStorage.getItem("userInfo"))
//   : null;

// const initialState = {
//   loading: false,
//   userInfo: userInfoFromStorage,
//   error: null,
// };

// // Async Thunk for User Registration
// export const registerUser = createAsyncThunk(
//   "user/register",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const config = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       };
//       // 'userData' yahan ek FormData object hoga
//       const { data } = await axios.post(
//         "http://localhost:5000/api/users/register",
//         userData,
//         config
//       );
//       localStorage.setItem("userInfo", JSON.stringify(data));
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message || error.message);
//     }
//   }
// );

// // Async Thunk for User Login
// export const loginUser = createAsyncThunk(
//   "user/login",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };
//       const { data } = await axios.post(
//         "http://localhost:5000/api/users/login",
//         { email, password },
//         config
//       );
//       localStorage.setItem("userInfo", JSON.stringify(data));
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message || error.message);
//     }
//   }
// );

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       localStorage.removeItem("userInfo");
//       state.loading = false;
//       state.userInfo = null;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Register
//     builder.addCase(registerUser.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(registerUser.fulfilled, (state, { payload }) => {
//       state.loading = false;
//       state.userInfo = payload;
//     });
//     builder.addCase(registerUser.rejected, (state, { payload }) => {
//       state.loading = false;
//       state.error = payload;
//     });

//     // Login
//     builder.addCase(loginUser.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(loginUser.fulfilled, (state, { payload }) => {
//       state.loading = false;
//       state.userInfo = payload;
//     });
//     builder.addCase(loginUser.rejected, (state, { payload }) => {
//       state.loading = false;
//       state.error = payload;
//     });
//   },
// });

// export const { logout } = userSlice.actions;
// export default userSlice.reducer;
