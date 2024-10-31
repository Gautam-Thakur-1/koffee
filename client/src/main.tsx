import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./pages/App.tsx";
import Register from "./pages/register.tsx";
import Login from "./pages/login.tsx";
import Dashboard from "./pages/dashboard.tsx";
import useAuthStore from "./stores/useAuthStore.ts";

const Main = () => {
  const authStore: any = useAuthStore();
  const checkAuth = authStore.checkAuth;

  useEffect(() => {
    checkAuth();
  }, []);

  const isAuthenticated = authStore.isAuthenticated;

  console.log(isAuthenticated);

  const protectRoute = (element: React.ReactNode) => {
    return isAuthenticated ? element : <Navigate to="/auth/login" />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/auth/register",
      element: isAuthenticated ? (
        <Navigate to="/user/dashboard" />
      ) : (
        <Register />
      ),
    },
    {
      path: "/auth/login",
      element: isAuthenticated ? <Navigate to="/user/dashboard" /> : <Login />,
    },
    {
      path: "/user/dashboard",
      element: protectRoute(<Dashboard />),
    },
  ]);

  return (
    <StrictMode>
      <Toaster />
      <RouterProvider router={router} />
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
