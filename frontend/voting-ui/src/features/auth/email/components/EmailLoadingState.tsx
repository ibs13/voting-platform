import { PageCard } from "@/shared/ui/PageCard";
import { PageShell } from "@/shared/ui/PageShell";

export const EmailLoadingState = () => {
  return (
    <PageShell centered className="px-4">
      <PageCard title="Loading Election" className="w-full max-w-md">
        <p className="text-center text-gray-600">Loading election...</p>
      </PageCard>
    </PageShell>
  );
};
