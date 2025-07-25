import { createBrowserRouter } from "react-router-dom";

// import Layout from "./Layout";
import HomeScreen from "../pages/Home";
import Layout from "./Layout";
import ProductsScreen from "../pages/Products";

// const baseUrl = import.meta.env.VITE_BASE_URL || "";

const router = createBrowserRouter([
  {
    path: `/`,
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomeScreen />,
      },
      {
        path: "products",
        element: <ProductsScreen />,
      },
    ],
  },
]);

// const router = createBrowserRouter(
//   [
//     {
//       path: `/`,
//       element: <Layout />,
//       // element: <Layout />,
//       children: [
//         {
//           path: "",
//           element: (
//             // <ProtectedRoute>
//             <HomeScreen />
//             // </ProtectedRoute>
//           ),
//         },
//       ],
//     },
//     // { path: "/login", element: <LoginScreen /> },
//     // {
//     //   path: "/500",
//     //   element: <ServerError500 />,
//     // },

//     // {
//     //   path: "*",
//     //   element: <NotFound404 />,
//     // },
//   ],
// //   {
// //     basename: baseUrl,
// //   }
// );

// export default router;
export default router;
