import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";

type DeleteCandidateDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteCandidateDialog = ({
  open,
  onConfirm,
  onCancel,
}: DeleteCandidateDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Candidate"
      message="Are you sure you want to delete this candidate?"
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
