import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import {
  selectAllProducts,
  selectProductError,
  selectProductStatus,
} from "../../data/productSlice";
import { fetchProducts } from "../../data/productSlice";

const ProductsScreen = () => {
  const dispatch = useAppDispatch();

  // Use selectors to get data from the Redux state
  const products = useAppSelector(selectAllProducts);
  const status = useAppSelector(selectProductStatus);
  const error = useAppSelector(selectProductError);

  // Use the useEffect hook to dispatch the fetchProducts thunk when the component first mounts
  useEffect(() => {
    // We only want to fetch if the status is 'idle' to avoid re-fetching on every render
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <div>Loading products...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }
  console.log("products:", products);
  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.length > 0 &&
          products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProductsScreen;
