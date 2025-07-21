import "./App.css";
import { Provider } from "react-redux";
import store from "./data/store";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { CssBaseline } from "@mui/material";
function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <RouterProvider router={router} />
      {/* <GlobalSnackbar />

      <Modal /> */}
      <div></div>
    </Provider>
  );
}

export default App;
