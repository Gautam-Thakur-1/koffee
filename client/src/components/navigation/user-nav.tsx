import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import UserAvatar from "../user-avatar";

const UserNav = () => {
  const pathname = window.location.pathname;

  return (
    <div className="w-full h-12 border-b">
      <div className="lg:max-w-7xl mx-auto flex items-center h-full justify-between">
        <nav className="flex items-center gap-x-2 h-full">
          <img src={"/src/assets/logo.svg"} alt="logo" className="w-24" />

          <ul className="flex h-full items-center gap-x-4">
            {navLinks.map((link) => (
              <Link
                to={link.path}
                key={link.label}
                className={`text-sm h-full flex items-center justify-center hover:text-neutral-900 ${
                  pathname === link.path ? "border-b border-black text-black" : "text-neutral-400"
                }`}
              >
                <p>{link.label}</p>
              </Link>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-x-2">
          {/* TODO: Build a notification functionality */}

          <Button size={"icon"} variant={"ghost"} className="rounded-full">
            <Bell />
          </Button>

          <UserAvatar />
        </div>
      </div>
    </div>
  );
};

export default UserNav;

const navLinks = [
  {
    label: "Dashboard",
    path: "/user/dashboard",
  },
  {
    label: "Marketplace",
    path: "/marketplace",
  },
  {
    label: "Support",
    path: "/support",
  },
];
