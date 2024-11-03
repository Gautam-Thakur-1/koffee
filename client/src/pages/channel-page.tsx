import { Navigate, useParams } from "react-router-dom";

import Editor from "../channel/Editor";
import ChannelNav from "../channel/channel-nav";

const ChannelPage = () => {
  const { channelId } = useParams();

  if (!channelId) {
    return <Navigate to={"/user/dashboard"} />;
  }

  return (
    <>
      <ChannelNav />

      <div className="max-w-3xl min-h-[calc(100vh-4.5rem)] h-full mt-12 p-4 mx-auto">
        <Editor channelId={channelId} />
      </div>
    </>
  );
};

export default ChannelPage;
