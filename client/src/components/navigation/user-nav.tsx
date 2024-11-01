import { Link, useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { Button } from "../ui/button";
import UserAvatar from "../user-avatar";
import UserSidebar from "./user-sidebar";

const UserNav = () => {
  const location = useLocation();

  return (
    <div className="w-full h-12 border-b px-4">
      <div className="lg:max-w-7xl mx-auto flex items-center h-full justify-between">
        <nav className="flex items-center gap-x-2 h-full">
          <img src={"/src/assets/logo.svg"} alt="logo" className="w-24" />

          <ul className="hidden md:flex h-full items-center gap-x-4">
            {navLinks.map((link) => (
              <Link
                to={link.path}
                key={link.label}
                className={`text-sm h-full flex items-center justify-center hover:text-neutral-900 ${
                  location.pathname === link.path
                    ? "border-b border-black text-black"
                    : "text-neutral-400"
                }`}
              >
                <p>{link.label}</p>
              </Link>
            ))}
          </ul>
        </nav>

        <div className="md:flex items-center gap-x-2 hidden">
          {/* TODO: Build a notification functionality */}

          <Button size={"icon"} variant={"ghost"} className="rounded-full">
            <Bell />
          </Button>

          <UserAvatar />
        </div>

        <div className="block md:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu size={22} />
            </SheetTrigger>
            <SheetContent className="pt-8 px-0">
              <SheetHeader className="w-full text-left mb-4 pl-2">
                <SheetTitle className="text-2xl">Navigation Menu</SheetTitle>
              </SheetHeader>
              <UserSidebar navLinks={navLinks} activeLink={location.pathname} />
            </SheetContent>
          </Sheet>
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
