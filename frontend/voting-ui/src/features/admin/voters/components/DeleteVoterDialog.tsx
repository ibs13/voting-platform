import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";

type DeleteVoterDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteVoterDialog = ({
  open,
  onConfirm,
  onCancel,
}: DeleteVoterDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Voter"
      message="Are you sure you want to delete this voter?"
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
