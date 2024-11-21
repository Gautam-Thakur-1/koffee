import { CheckCircle2 } from "lucide-react";
import WaitingLoader from "../../../components/waiting-loader";

const ConnectionStatusPage = ({
  connectionStatus,
}: {
  connectionStatus: "connected" | "waiting" | "denied" | "error";
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
      {connectionStatus === "waiting" && (
        <div className="flex flex-col items-center">
          <WaitingLoader />

          <h1 className="mt-6 text-xl">Asking to Connect</h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we connect you to the channel.
          </p>

          <div className="space-y-2 mt-4">
            <h3 className="text-center">While you wait:</h3>
            <ul className="text-sm">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <span>Ensure your internet connection is stable.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <span>Consider the main points for discussion.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusPage;
