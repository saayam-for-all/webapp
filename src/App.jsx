import React, { useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import { useDispatch } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout";
import Error404 from "./pages/Error404/Error404";
import { checkAuthStatus } from "./redux/features/authentication/authActions";
import { loginFailure } from "./redux/features/authentication/authSlice";
import routes from "./routes/routes";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import { completePendingLinkedInLogout } from "./utils/auth/linkedInLogout";

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
    if (completePendingLinkedInLogout()) {
      return undefined;
    }
    const searchParams = new URLSearchParams(window.location.search);
    const hasOAuthRedirectParams =
      searchParams.has("code") ||
      searchParams.has("error") ||
      searchParams.has("error_description");
    let fallbackTimer;

    const refreshAuthState = () => {
      dispatch(checkAuthStatus());
    };

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
        case "signedIn":
          if (fallbackTimer) {
            window.clearTimeout(fallbackTimer);
          }
          refreshAuthState();
          break;
        case "signInWithRedirect_failure":
          if (fallbackTimer) {
            window.clearTimeout(fallbackTimer);
          }
          dispatch(
            loginFailure(payload.data?.message || "OAuth sign-in failed"),
          );
          break;
        default:
          break;
      }
    });

    if (hasOAuthRedirectParams) {
      fallbackTimer = window.setTimeout(() => {
        refreshAuthState();
      }, 1500);

      return () => {
        window.clearTimeout(fallbackTimer);
        unsubscribe();
      };
    }

    refreshAuthState();

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
