import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  createdAt: string;
}

type NewProduct = Omit<Product, "id" | "createdAt">;
type UpdateProductArg = Partial<Product> & { id: number };

export interface ProductState {
  entities: Product[];
  // We can track a single selected product, useful for detail views
  selectedEntity: Product | null;
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  entities: [],
  selectedEntity: null,
  loading: "idle",
  error: null,
};
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/product`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Get the full JSON response
      const apiResponse = await response.json();

      // Return only the 'data' property which contains the product array
      return apiResponse.data as Product[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk<Product, number>(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      return (await response.json()) as Product;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch products");
    }
  }
);

export const createProduct = createAsyncThunk<Product, NewProduct>(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/product/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error("Failed to create product");
      }
      return (await response.json()) as Product;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch products");
    }
  }
);

export const updateProduct = createAsyncThunk<Product, UpdateProductArg>(
  "products/updateProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${productData.id}`, {
        method: "PUT", // Or 'PATCH' if your API supports partial updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      return (await response.json()) as Product;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch products");
    }
  }
);

export const deleteProduct = createAsyncThunk<number, number>(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      // Return the id of the deleted product on success
      return productId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch products");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  // Standard reducers for synchronous state changes
  reducers: {
    clearSelectedProduct: (state: ProductState) => {
      state.selectedEntity = null;
    },
  },
  // Extra reducers for handling async thunk lifecycle actions
  extraReducers: (builder) => {
    builder
      // Generic pending and rejected handlers for all thunks

      // fetchProducts
      .addCase(
        fetchProducts.fulfilled,
        (state: ProductState, action: PayloadAction<Product[]>) => {
          state.loading = "succeeded";
          state.entities = action.payload;
        }
      )
      // fetchProductById
      .addCase(
        fetchProductById.fulfilled,
        (state: ProductState, action: PayloadAction<Product>) => {
          state.loading = "succeeded";
          state.selectedEntity = action.payload;
        }
      )
      // createProduct
      .addCase(
        createProduct.fulfilled,
        (state: ProductState, action: PayloadAction<Product>) => {
          state.loading = "succeeded";
          state.entities.push(action.payload);
        }
      )
      // updateProduct
      .addCase(
        updateProduct.fulfilled,
        (state: ProductState, action: PayloadAction<Product>) => {
          state.loading = "succeeded";
          const index = state.entities.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.entities[index] = action.payload;
          }
          // Also update the selected entity if it matches
          if (state.selectedEntity?.id === action.payload.id) {
            state.selectedEntity = action.payload;
          }
        }
      )
      // deleteProduct
      .addCase(
        deleteProduct.fulfilled,
        (state: ProductState, action: PayloadAction<number>) => {
          state.loading = "succeeded";
          // The payload is the productId
          state.entities = state.entities.filter(
            (p) => p.id !== action.payload
          );
          // Clear the selected entity if it was the one deleted
          if (state.selectedEntity?.id === action.payload) {
            state.selectedEntity = null;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state: ProductState) => {
          state.loading = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is { type: string; payload?: string } =>
          action.type.endsWith("/rejected"),
        (state: ProductState, action) => {
          state.loading = "failed";
          state.error =
            (action.payload as string) || "An unknown error occurred";
        }
      );
  },
});

// Selectors
export const selectAllProducts = (state: RootState) => state.products.entities;
export const selectProductStatus = (state: RootState) => state.products.loading;
export const selectProductError = (state: RootState) => state.products.error;

// Export the reducer as the default export
export default productSlice.reducer;
