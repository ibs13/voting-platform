type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusClass =
    status === "Open"
      ? "bg-green-100 text-green-700"
      : status === "Closed"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass}`}
    >
      {status}
    </span>
  );
};
