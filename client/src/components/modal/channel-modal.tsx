import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  channelId: string;
  loading: boolean;
}

const ChannelModal = ({
  isOpen,
  onClose,
  onConfirm,
  channelId,
  loading,
}: ChannelModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);

    setCopied(true);
  };

  if (copied) {
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  }

  return (
    <Modal
      title={"Create Channel"}
      description={"New channel for your team to collaborate"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="w-full mb-5 flex gap-x-4 items-center">
        <Input
          value={channelId}
          onChange={() => {}}
          placeholder={"Channel ID"}
          readOnly
        />

        {/* Add copy to clipboard button */}
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => handleCopy(channelId)}
        >
          {!copied ? (
            <Clipboard size={16} />
          ) : (
            <Check size={16} className="text-green-500" />
          )}
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

export default ChannelModal;
