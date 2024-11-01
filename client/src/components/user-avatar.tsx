import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import LogoutModal from "./modal/logout-modal";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  LibraryBig,
  LogOut,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const UserAvatar = () => {
  const authStore: any = useAuthStore();
  const user = authStore.user;
  const logout = authStore.logout;
  const loading = authStore.loading;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <LogoutModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={logout}
        loading={loading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-x-3 z-30 cursor-pointer">
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <p className="text-neutral-500 hover:text-neutral-800 flex items-center gap-x-1 text-xs">
              Account
              {/* {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />} */}
            </p>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuItem className="flex items-center font-normal gap-x-2">
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col ml-2">
              <p className="text-neutral-500">{user?.name}</p>
              <Link
                to={"/user/profile"}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Edit your profile
              </Link>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Link to={"/user/settings"} className="flex items-center">
              <Settings className="mr-2" />
              Account settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Link to={"/user/workspace"} className="flex items-center">
              <LibraryBig className="mr-2" />
              Workspaces
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer" asChild>
            <button
              className="flex items-center w-full"
              onClick={() => setIsOpen(true)}
            >
              <LogOut className="mr-2" />
              Sign Out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserAvatar;
