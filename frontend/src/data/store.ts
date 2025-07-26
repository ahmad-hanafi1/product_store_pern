// store.tsx
import {
  type Action,
  configureStore,
  type ThunkAction,
} from "@reduxjs/toolkit";
import  productSlice  from "./productSlice";

const rootReducer = {
  products: productSlice,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // devTools: true,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
