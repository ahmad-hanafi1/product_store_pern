import "./App.css";
import { Provider } from "react-redux";
import store from "./data/store";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { CssBaseline } from "@mui/material";
import { AppThemeProvider } from "./context/ThemeProvider";

function App() {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <CssBaseline />
        <RouterProvider router={router} />
        {/* <GlobalSnackbar />
          <Modal /> */}

        <div></div>
      </AppThemeProvider>
    </Provider>
  );
}

export default App;
