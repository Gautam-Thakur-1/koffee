import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../channel/Editor";
import ChannelNav from "../channel/channel-nav";

const ChannelPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!channelId) {
      navigate("/user/dashboard");
    }
  }, [channelId, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      sessionStorage.setItem("isReloading", "true");
      e.preventDefault();
      return true;
    };

    const checkReloadState = () => {
      const wasReloading = sessionStorage.getItem("isReloading");
      if (wasReloading) {
        sessionStorage.removeItem("isReloading");
        navigate("/user/dashboard");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    checkReloadState();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  if (!channelId) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <ChannelNav />
      <main className="max-w-3xl min-h-[calc(100vh-4.5rem)] h-full mt-12 p-4 mx-auto">
        <Editor channelId={channelId} />
      </main>
    </div>
  );
};

export default ChannelPage;
