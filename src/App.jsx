import React, { useEffect } from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout";
import routes from "./routes/routes";
import Error404 from "./pages/Error404/Error404";
import { handleAuthResponse } from "./authResponseHandler";

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <Error404 />,
    children: routes,
  },
]);

const App = () => {
  useEffect(() => {
    handleAuthResponse();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
