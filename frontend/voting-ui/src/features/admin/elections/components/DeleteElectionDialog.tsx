import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";

type DeleteElectionDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteElectionDialog = ({
  open,
  onConfirm,
  onCancel,
}: DeleteElectionDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Election"
      message="Are you sure you want to delete this election?"
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
