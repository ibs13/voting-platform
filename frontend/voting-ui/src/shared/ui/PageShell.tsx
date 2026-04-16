type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
};

export const PageShell = ({
  children,
  className = "",
  centered = false,
}: PageShellProps) => {
  return (
    <div
      className={[
        "min-h-screen bg-gray-100",
        centered
          ? "flex items-center justify-center"
          : "flex justify-center py-10",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
};
