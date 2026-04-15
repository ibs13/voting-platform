type AlertProps = {
  type: "success" | "error" | "info";
  children: React.ReactNode;
};

export const Alert = ({ type, children }: AlertProps) => {
  const styles = {
    success: "bg-green-100 text-green-800 border-green-200 mb-4",
    error: "bg-red-100 text-red-800 border-red-200 mb-4",
    info: "bg-blue-100 text-blue-800 border-blue-200 mb-4",
  };

  return <div className={`border rounded p-3 ${styles[type]}`}>{children}</div>;
};
