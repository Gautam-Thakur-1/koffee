import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Clipboard } from "lucide-react";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const SessionModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: SessionModalProps) => {
  const [sessionId, setSessionId] = useState<string>("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Modal
      title={"Create Session"}
      description={"New session for your team to collaborate"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="w-full mb-5 flex gap-x-4 items-center">
        <Input
          disabled
          placeholder="1234-5678-9012"
          value={"1234-5678-9012"}
          className=""
        />

        {/* Add copy to clipboard button */}
        <Button size={"icon"} variant={"outline"}>
          <Clipboard size={18}/>
        </Button>
      </div>
      <div className={"w-full space-x-2 flex items-center justify-end"}>
        <Button variant={"outline"} disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={onConfirm}>
          Create
        </Button>
      </div>
    </Modal>
  );
};

export default SessionModal;
