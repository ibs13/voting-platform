type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  children: React.ReactNode;
};

export const FormSelect = ({
  label,
  error,
  className = "",
  id,
  children,
  ...props
}: FormSelectProps) => {
  const selectId =
    id || props.name || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium">
          {label}
        </label>
      )}

      <select
        id={selectId}
        {...props}
        className={`w-full rounded border p-3 outline-none transition focus:ring-2 focus:ring-blue-200 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
      >
        {children}
      </select>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
