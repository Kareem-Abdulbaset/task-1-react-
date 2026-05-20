import { SearchX } from "lucide-react";

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting the current filters.",
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <SearchX className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
