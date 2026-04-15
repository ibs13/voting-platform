type SectionCardProps = {
  title?: string;
  className?: string;
  titleClassName?: string;
  children: React.ReactNode;
};

export const SectionCard = ({
  title,
  className = "",
  titleClassName = "",
  children,
}: SectionCardProps) => {
  return (
    <section className={`rounded border p-4 ${className}`}>
      {title && (
        <h3 className={`text-lg font-semibold ${titleClassName}`}>{title}</h3>
      )}

      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  );
};
