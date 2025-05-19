import { accessLabel } from "@/lib/utils";

export function VisitsCount({ visits }: { visits: number }) {
  return (
    <span className="text-muted-foreground text-sm">{accessLabel(visits)}</span>
  );
}
