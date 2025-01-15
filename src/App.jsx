import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import Layout from "./Layout/Layout";
import routes from "./routes/routes";
import Error404 from "./pages/Error404/Error404";
import { checkAuthStatus } from "./redux/features/authentication/authActions";

import "./App.css";
import "react-datepicker/dist/react-datepicker.css";

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <Error404 />,
    children: routes,
  },
]);

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, []);
  return <RouterProvider router={router} />;
};

export default App;
