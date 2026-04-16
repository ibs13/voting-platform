type ButtonVariant =
  | "primary"
  | "success"
  | "danger"
  | "secondary"
  | "indigo"
  | "purple"
  | "pink";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
};

const baseClasses =
  "inline-flex items-center justify-center rounded px-4 py-2 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-sky-600 hover:bg-sky-700",
  success: "bg-green-600 hover:bg-green-700",
  danger: "bg-red-600 hover:bg-red-700",
  secondary: "bg-slate-700 hover:bg-slate-800",
  indigo: "bg-indigo-600 hover:bg-indigo-700",
  purple: "bg-purple-600 hover:bg-purple-700",
  pink: "bg-pink-600 hover:bg-pink-700",
};

export const Button = ({
  children,
  className = "",
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  disabled,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={[
        baseClasses,
        variantClasses[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
};
