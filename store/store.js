// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import coinReducer from './coinSlice';

export const store = configureStore({
  reducer: {
    coin: coinReducer,
  },
});
