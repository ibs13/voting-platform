import { OfficeResultCard } from "./OfficeResultCard";
import type { OfficeResult } from "../types/resultTypes";

type ResultOfficeListProps = {
  offices: OfficeResult[];
};

export const ResultOfficeList = ({ offices }: ResultOfficeListProps) => {
  return (
    <div className="space-y-6">
      {offices.map((office) => (
        <OfficeResultCard key={office.office} office={office} />
      ))}
    </div>
  );
};
