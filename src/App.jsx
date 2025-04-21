import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout";
import Error404 from "./pages/Error404/Error404";
import { checkAuthStatus } from "./redux/features/authentication/authActions";
import routes from "./routes/routes";
import { createTheme, ThemeProvider, Typography, Button } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

const theme = createTheme({
  typography: {
    // Override the default font family
    fontFamily: '"Josefin Sans", sans-serif',
  },
});

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
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />;
    </ThemeProvider>
  );
};

export default App;
