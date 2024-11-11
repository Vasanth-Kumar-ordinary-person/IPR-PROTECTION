import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patentReducer from './slices/patentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patents: patentReducer,
  },
});

export default store; 