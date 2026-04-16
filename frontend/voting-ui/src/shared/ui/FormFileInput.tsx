type FormFileInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const FormFileInput = ({
  label,
  error,
  className = "",
  id,
  ...props
}: FormFileInputProps) => {
  const inputId = id || props.name || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium">
          {label}
        </label>
      )}

      <input
        id={inputId}
        type="file"
        {...props}
        className={`w-full rounded border p-3 ${error ? "border-red-500" : "border-gray-300"} ${className}`}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
