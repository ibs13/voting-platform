import { Button } from "./Button";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?:
    | "primary"
    | "success"
    | "danger"
    | "secondary"
    | "indigo"
    | "purple"
    | "pink";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  open,
  title = "Please confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-3 text-sm text-gray-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
