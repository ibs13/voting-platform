type PageCardProps = {
  title?: string;
  className?: string;
  titleClassName?: string;
  children: React.ReactNode;
};

export const PageCard = ({
  title,
  className = "",
  titleClassName = "",
  children,
}: PageCardProps) => {
  return (
    <div className={`w-full rounded-lg bg-white p-8 shadow-md ${className}`}>
      {title && (
        <h2 className={`text-2xl font-bold ${titleClassName}`}>{title}</h2>
      )}

      <div className={title ? "mt-6" : ""}>{children}</div>
    </div>
  );
};
