import { RefreshCcw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-bold text-red-900">Unable to load data</h2>
      <p className="mt-2 text-sm text-red-700">
        {message || "Please try again later."}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
        >
          <RefreshCcw className="h-4 w-4" />
          Try again
        </button>
      ) : null}
    </div>
  );
}
