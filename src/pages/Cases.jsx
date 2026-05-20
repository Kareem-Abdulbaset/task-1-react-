import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getApiErrorMessage } from "../api/apiClient.js";
import { getCasesRequest } from "../api/casesApi.js";
import CaseIcon from "../components/common/CaseIcon.jsx";
import DifficultyBadge from "../components/common/DifficultyBadge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import { normalizeCase, truncateText } from "../utils/caseUtils.js";

const difficulties = ["All Difficulties", "Easy", "Medium", "Hard"];

export default function Cases() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [difficulty, setDifficulty] = useState(
    searchParams.get("difficulty") || "All Difficulties",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadCases() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const rawCases = await getCasesRequest();
      setCases(rawCases.map((item, index) => normalizeCase(item, index)));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    const params = {};

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    if (difficulty !== "All Difficulties") {
      params.difficulty = difficulty;
    }

    setSearchParams(params, { replace: true });
  }, [difficulty, searchTerm, setSearchParams]);

  const filteredCases = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return cases.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.complaint.toLowerCase().includes(normalizedSearch);
      const matchesDifficulty =
        difficulty === "All Difficulties" || item.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [cases, difficulty, searchTerm]);

  function clearFilters() {
    setSearchTerm("");
    setDifficulty("All Difficulties");
  }

  const hasFilters = searchTerm.trim() || difficulty !== "All Difficulties";

  if (isLoading) {
    return <LoadingState label="Loading medical cases..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} onRetry={loadCases} />;
  }

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
            Medical Cases
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Browse and explore all seeded medical cases.
          </p>
        </div>
        <button
          type="button"
          onClick={loadCases}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white px-5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 sm:w-auto"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </section>

      <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:flex-row">
          <label className="relative block w-full flex-1 md:max-w-[540px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title or complaint..."
              className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:w-[260px]"
          >
            {difficulties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <p className="text-sm font-semibold text-slate-600">
            {filteredCases.length} cases found
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Clear Filters
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </section>

      {filteredCases.length ? (
        <>
          <section className="grid gap-4 md:hidden">
            {filteredCases.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <CaseIcon title={item.title} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-base font-bold text-slate-950">
                        {item.title}
                      </h2>
                      <DifficultyBadge value={item.difficulty} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Complaint: {truncateText(item.complaint, 74)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-blue-600" />
                    {item.patientLabel}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {item.updatedLabel}
                  </div>
                </div>

                <Link
                  to={`/cases/${item.id}`}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-3 rounded-lg border border-blue-500 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  View Case
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </section>

          <section className="hidden rounded-lg border border-slate-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500">
                  <th className="px-5 py-4">Case</th>
                  <th className="px-5 py-4">Patient</th>
                  <th className="px-5 py-4">Difficulty</th>
                  <th className="px-5 py-4">Updated</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-5">
                        <CaseIcon title={item.title} />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-950">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Complaint: {truncateText(item.complaint, 48)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <UserRound className="h-4 w-4 text-blue-600" />
                        {item.patientLabel}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <DifficultyBadge value={item.difficulty} />
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <CalendarDays className="h-4 w-4" />
                        {item.updatedLabel}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <Link
                        to={`/cases/${item.id}`}
                        className="inline-flex h-10 items-center justify-center gap-3 rounded-lg border border-blue-500 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        View Case
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </section>
        </>
      ) : (
        <EmptyState
          title="No cases match your filters"
          description="Search by another title, complaint, or choose a different difficulty."
        />
      )}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-600">
          Showing {filteredCases.length ? 1 : 0} to {filteredCases.length} of{" "}
          {filteredCases.length} cases
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500 bg-white text-sm font-bold text-blue-600"
          >
            1
          </button>
          <button
            type="button"
            disabled
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
