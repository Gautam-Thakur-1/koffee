import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: LogoutModalProps) => {
  return (
    <Modal
      title={"Logout Confirmation"}
      description={"You will be logged out from your account."}
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

export default LogoutModal;
