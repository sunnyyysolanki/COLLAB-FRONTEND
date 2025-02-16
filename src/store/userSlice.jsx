import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchuser = createAsyncThunk(
  "fetch_user",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "An error occurred");
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
    isAuth: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchuser.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Reset error state when starting a request
      })
      .addCase(fetchuser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(fetchuser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message || "Failed to fetch user";
        state.user = null;
        state.isAuth = false;
      });
  },

  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.isAuth = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
