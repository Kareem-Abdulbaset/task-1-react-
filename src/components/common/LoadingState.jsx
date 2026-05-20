export default function LoadingState({ label = "Loading data..." }) {
  return (
    <div className="flex min-h-60 items-center justify-center rounded-lg border border-slate-200 bg-white p-8">
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
        {label}
      </div>
    </div>
  );
}
