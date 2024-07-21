// In store/coinSlice.js
import { createSlice } from '@reduxjs/toolkit';

const coinSlice = createSlice({
  name: 'coin',
  initialState: {
    coins: [],
    loading: false,
    error: null,
    page: 1,
  },
  reducers: {
    fetchCoinsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCoinsSuccess(state, action) {
      state.coins = action.payload.coins;
      state.loading = false;
    },
    fetchCoinsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
});

export const { fetchCoinsStart, fetchCoinsSuccess, fetchCoinsFailure, setPage } = coinSlice.actions;
export default coinSlice.reducer;
