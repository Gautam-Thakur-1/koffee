import { v4 as uuidv4 } from "uuid";
import { Merge, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import greetUser from "../../lib/greet-user";
import useAuthStore from "../../stores/useAuthStore";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import ChannelModal from "../modal/channel-modal";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { createChannel } from "../../actions/channel-actions";

const Dashboard = () => {
  const authStore: any = useAuthStore();
  const user = authStore.user;

  const navigate = useNavigate();

  if (!user) {
    return navigate("/auth/login");
  }

  const [open, setOpen] = useState(false);
  const [connectionString, setConnectionString] = useState("");
  const [connectionType, setConnectionType] = useState<
    "connect" | "request-access"
  >("request-access");
  const [loading, setLoading] = useState(false);
  const [channelId, setChannelId] = useState("");

  useEffect(() => {
    setChannelId(uuidv4());
  }, []);

  const handleConnectChannel = (connectionString: string) => {
    setConnectionType("request-access");

    if (!connectionString) {
      toast.error("Please enter a connection string");
    } else if (connectionString.length < 36) {
      toast.error("Invalid connection string");
    } else if (connectionString.length === 36) {
      navigate(`/channel/${connectionString}?type=${connectionType}`);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleCreateChannel = async (channelId: string) => {
    try {
      setLoading(true);
      setOpen(false);

      const res = await createChannel(
        channelId,
        "Untitled",
        "Channel for collaboration",
        user.id
      );

      if (res.error) {
        toast.error(res.error);
      } else {
        setConnectionType("connect");
        return navigate(`/channel/${channelId}?type=${connectionType}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ChannelModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleCreateChannel(channelId)}
        channelId={channelId}
        loading={loading}
      />

      <div className="w-full h-full p-4">
        <h1 className="font-bold text-xl">{greetUser(user?.name)}</h1>
        <p className="text-sm text-neutral-500">
          Welcome back! Ready to create, collaborate, and bring ideas to life?
        </p>

        <div className="my-4 flex items-center gap-x-4 md:max-w-sm">
          <Input
            type="text"
            placeholder="Paste connection string"
            className="text-xs"
            maxLength={36}
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
          />

          <Button
            onClick={() => handleConnectChannel(connectionString)}
            className="flex items-center"
            size={"sm"}
            disabled={!connectionString}
          >
            <Merge size={14} />
            <span>Connect</span>
          </Button>
        </div>

        <div className="my-4 md:max-w-sm border rounded-md p-3">
          <div className="flex items-center gap-x-2">
            <Plus className="text-green-400" size={22} />
            <span className="font-bold">Create Channel</span>
          </div>

          <p className="text-xs text-neutral-500 my-2">
            Create new channel and invite others.
          </p>

          <Button
            className="w-full text-xs mt-2 mb-4"
            size={"sm"}
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            Create New Channel
          </Button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
