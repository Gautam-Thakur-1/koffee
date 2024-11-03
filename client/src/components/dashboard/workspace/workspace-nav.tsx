import {
  AtSign,
  DollarSign,
  Grid2X2,
  LayoutPanelTop,
  Settings2,
  User2,
  UsersRound,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import WorkspaceTeams from "./workspace-teams";
import WorkspaceProjects from "./workspace-projects";
import ProfileSetting from "../user/profile-setting";
import Account from "../user/account";
import { Button } from "../../ui/button";
import { Link, useLocation } from "react-router-dom";

interface WorkspaceNavProps {
  userName: string;
}

const WorkspaceNav = ({ userName }: WorkspaceNavProps) => {
  const location = useLocation();

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full py-4 ">
      <Select>
        <SelectTrigger className="w-full font-bold">
          <SelectValue placeholder={`${userName}'s Workspace`} />
        </SelectTrigger>
        <SelectContent>
          {/* TODO: Add workspaces of user */}
          <SelectItem value="default workspace">
            {userName}'s workspace
          </SelectItem>
          <SelectItem value="custom workspace">custom workspace</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-col w-full items-start my-4">
        {workspaceRoutes.map((route) => (
          <Link to={route.path} className="w-full">
            <Button
              variant="ghost"
              className={`w-full flex justify-start ${
                location.pathname === route.path ? "bg-neutral-100" : ""
              }`}
            >
              <div className="flex gap-x-2">
                {route.icon}
                <p>{route.label}</p>
              </div>
            </Button>
          </Link>
        ))}
      </div>

      <div className="flex flex-col w-full items-start my-4">
        <h1 className="font-light text-zinc-500 p-2">Settings</h1>

        {userSettingsRoutes.map((route) => (
          <Link to={route.path} className="w-full">
            <Button
              variant="ghost"
              className={`w-full flex justify-start ${
                location.pathname === route.path ? "bg-neutral-200" : ""
              }`}
            >
              <div className="flex gap-x-2">
                {route.icon}
                <p>{route.label}</p>
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceNav;

const workspaceRoutes = [
  {
    label: "General",
    path: "/user/dashboard",
    icon: <Settings2 size={12} />,
  },
  {
    label: "Team",
    path: "/user/dashboard/workspace/team",
    icon: <UsersRound size={12} />,
    element: <WorkspaceTeams />,
  },
  {
    label: "Projects",
    path: "/user/dashboard/workspace/projects",
    icon: <LayoutPanelTop size={12} />,
    element: <WorkspaceProjects />,
  },
];

const userSettingsRoutes = [
  {
    label: "Profile",
    path: "/user/dashboard/settings/profile",
    icon: <User2 size={12} />,
    element: <ProfileSetting />,
  },
  {
    label: "Account",
    path: "/user/dashboard/settings/account",
    icon: <AtSign size={12} />,
    element: <Account />,
  },
  {
    label: "Billing",
    path: "/user/dashboard/settings/billing",
    icon: <DollarSign size={12} />,
    element: <div>Billing</div>,
  },
];
