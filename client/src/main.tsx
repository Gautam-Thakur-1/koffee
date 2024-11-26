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
import useAuthStore from "./stores/useAuthStore.ts";
import DashboardLayout from "./components/dashboard/layout.tsx";
import Dashboard from "./components/dashboard/dashboard.tsx";
import WorkspaceTeams from "./components/dashboard/workspace/workspace-teams.tsx";
import WorkspaceProjects from "./components/dashboard/workspace/workspace-projects.tsx";
import ProfileSetting from "./components/dashboard/user/profile-setting.tsx";
import Account from "./components/dashboard/user/account.tsx";
import ChannelPage from "./pages/channel-page.tsx";
import { Toaster as ShadcnToaster } from "./components/ui/toaster.tsx";

const Main = () => {
  const authStore: any = useAuthStore();
  const checkAuth = authStore.checkAuth;

  useEffect(() => {
    checkAuth();
  }, []);

  const isAuthenticated = authStore.isAuthenticated;

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
      path: "/channel/:channelId",
      element: <ChannelPage />,
    },
    {
      path: "/user/dashboard",
      element: protectRoute(<DashboardLayout />),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "workspace/team", element: <WorkspaceTeams /> },
        { path: "workspace/projects", element: <WorkspaceProjects /> },

        { path: "settings/profile", element: <ProfileSetting /> },
        { path: "settings/account", element: <Account /> },
        { path: "settings/billing", element: <div>Billing</div> },
      ],
    },
  ]);

  return (
    <StrictMode>
      <ShadcnToaster />
      <Toaster />
      <RouterProvider router={router} />
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
