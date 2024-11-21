const ChannelNav = ({
  connectionStatus,
}: {
  connectionStatus: "connected" | "waiting" | "denied" | "error";
}) => {
  return (
    <div className="w-full h-12 flex items-center fixed top-0 justify-between px-4 border-b">
      <img src={"/src/assets/logo.svg"} alt="logo" className="w-24" />
      <div className="flex items-center">
        {connectionStatus === "waiting" && (
          <div className="text-sm text-gray-500">Waiting for connection</div>
        )}
        {connectionStatus === "connected" && (
          <div className="text-sm flex items-center p-2 text-green-500">
            <div className="w-1 h-1 rounded-full bg-green-500 mr-2 animate-ping"></div>
            Connected
          </div>
        )}
        {connectionStatus === "denied" && (
          <div className="text-sm text-red-500">Connection denied</div>
        )}
        {connectionStatus === "error" && (
          <div className="text-sm text-red-500">Connection error</div>
        )}
      </div>
    </div>
  );
};

export default ChannelNav;
