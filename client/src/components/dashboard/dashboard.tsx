import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import greetUser from "../../lib/greet-user";
import useAuthStore from "../../stores/useAuthStore";
import { Button } from "../ui/button";
import SessionTable from "../session-table";
import { useEffect, useState } from "react";
import ChannelModal from "../modal/channel-modal";

// TODO: Fix Session Modal functions

const Dashboard = () => {
  const authStore: any = useAuthStore();
  const user = authStore.user;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [channelId, setChannelId] = useState("");

  useEffect(() => {
    setChannelId(uuidv4());
  },[])

  const handleCreateChannel = () => {
    setLoading(true);
  };

  return (
    <>
      <ChannelModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleCreateChannel()}
        channelId={channelId}
        loading={false}
      />

      <div className="w-full h-full p-4">
        <h1 className="font-bold text-xl">{greetUser(user?.name)}</h1>
        <p className="text-sm text-neutral-500">
          Welcome back! Ready to create, collaborate, and bring ideas to life?
        </p>

        {/* Header */}
        <header className="w-full h-full flex items-center justify-between mt-6 py-2">
          <h1 className="text-lg">Sessions</h1>

          <Button className="text-xs" size={"sm"} onClick={() => setOpen(true)}>
            <Plus size={12} />
            <span className="ml-1">Create Channel</span>
          </Button>
        </header>

        <hr />

        {/* Sessions */}
        <SessionTable
          sessionsHeaders={["id", "Title", "Description", "Members", "Actions"]}
          sessionsData={sessions}
        />
      </div>
    </>
  );
};

export default Dashboard;

const sessions = [
  {
    id: "1",
    title: "Design Sprint",
    description: "loren ipsum dolor sit amet, consectetur adipiscing elit",
    members: [
      {
        id: "1",
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits",
      },
      {
        id: "2",
        name: "Jane Doe",
        avatar: "https://randomuser.me/api/portraits",
      },
    ],
  },
  {
    id: "2",
    title: "Product Design",
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit",
    members: [
      {
        id: "1",
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits",
      },
      {
        id: "2",
        name: "Jane Doe",
        avatar: "https://randomuser.me/api/portraits",
      },
    ],
  },
];
