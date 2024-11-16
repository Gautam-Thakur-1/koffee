import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface ReloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const ReloadModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: ReloadModalProps) => {
  return (
    <Modal
      title={"Are you sure?"}
      description={
        "Reloading the page will disconnect you from the current channel."
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={"w-full space-x-2 flex items-center justify-end"}>
        <Button variant={"outline"} disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button variant={"destructive"} disabled={loading} onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default ReloadModal;
