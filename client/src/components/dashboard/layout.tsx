import { Outlet } from "react-router-dom";
import UserNav from "../../components/navigation/user-nav";
import useAuthStore from "../../stores/useAuthStore";
import WorkspaceNav from "./workspace/workspace-nav";

const DashboardLayout = () => {
  const authStore: any = useAuthStore();
  const user = authStore.user;

  return (
    <>
      <UserNav />
      <div className="mx-auto lg:max-w-7xl h-full gap-x-4 flex p-2">
        <div className="hidden md:block md:max-w-56 lg:max-w-64 w-full h-full">
          <WorkspaceNav userName={user.name} />
        </div>

        <div className="w-full h-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
