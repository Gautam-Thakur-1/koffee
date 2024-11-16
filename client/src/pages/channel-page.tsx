import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../channel/Editor";
import useAuthStore from "../stores/useAuthStore";

const ChannelPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();

  const authStore: any = useAuthStore();
  const user = authStore.user;

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const userId = user.id;

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
    <>
      <Editor channelId={channelId} userId={userId} />
    </>
  );
};

export default ChannelPage;
