import { Link } from "react-router-dom";
import NavRoutes from "./nav-routes";
import { Button } from "../ui/button";
import useAuthStore from "../../stores/useAuthStore";

const MainNavbar = () => {
  const authStore: any = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  return (
    <div className="h-full w-full z-30">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link to={"/"} className="logo">
          <img src="../src/assets/logo.svg" alt="logo" className="w-28" />
        </Link>

        <div className="flex items-center gap-x-4">
          <NavRoutes />

          {isAuthenticated ? (
            <Link to="/user/dashboard">
              <Button className="bg-blue-500 hover:bg-blue-700">
                View Dashboard
              </Button>
            </Link>
          ) : (
            <Link to={"/auth/register"}>
              <Button>Get Started</Button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default MainNavbar;
