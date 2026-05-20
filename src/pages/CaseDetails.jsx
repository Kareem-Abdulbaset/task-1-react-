import {
  ArrowLeft,
  CalendarDays,
  ClipboardEdit,
  FileQuestion,
  Flag,
  Heart,
  HelpCircle,
  Info,
  ShieldPlus,
  Star,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../api/apiClient.js";
import { getCaseByIdRequest } from "../api/casesApi.js";
import CaseIcon from "../components/common/CaseIcon.jsx";
import DifficultyBadge from "../components/common/DifficultyBadge.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import { normalizeCase } from "../utils/caseUtils.js";

function InfoCard({ icon: Icon, title, children, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-100 text-blue-600",
    violet: "bg-violet-100 text-violet-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center gap-4">
        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            tones[tone],
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>
      <div className="mt-5 text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
        {children}
      </div>
    </section>
  );
}

function EmptyDetail({ label }) {
  return <p className="text-sm text-slate-500">{label} was not provided.</p>;
}

export default function CaseDetails() {
  const { caseId } = useParams();
  const [caseDetails, setCaseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadCaseDetails() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const rawCase = await getCaseByIdRequest(caseId);
      setCaseDetails(normalizeCase(rawCase));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCaseDetails();
  }, [caseId]);

  if (isLoading) {
    return <LoadingState label="Loading case details..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} onRetry={loadCaseDetails} />;
  }

  if (!caseDetails) {
    return (
      <ErrorState
        message="The selected case could not be found."
        onRetry={loadCaseDetails}
      />
    );
  }

  return (
    <div className="space-y-7">
      <Link
        to="/cases"
        className="inline-flex items-center gap-3 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cases
      </Link>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <CaseIcon title={caseDetails.title} size="lg" />
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold text-slate-950 sm:text-3xl">
                {caseDetails.title}
              </h1>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  <UserRound className="h-4 w-4 text-blue-600" />
                  {caseDetails.patientLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                  {caseDetails.updatedLabel}
                </span>
                <DifficultyBadge value={caseDetails.difficulty} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.success("Case added to favorites.")}
            className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white shadow-[0_12px_25px_rgba(37,99,235,0.22)] transition hover:bg-blue-700 sm:w-auto"
          >
            <Star className="h-5 w-5" />
            Add to Favorites
          </button>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[460px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <InfoCard icon={HelpCircle} title="Chief Complaint" tone="violet">
            {caseDetails.complaint ? (
              <p>{caseDetails.complaint}</p>
            ) : (
              <EmptyDetail label="Chief complaint" />
            )}
          </InfoCard>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-200 p-4 sm:p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Info className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-950">
                Patient Information
              </h2>
            </div>
            <dl className="divide-y divide-slate-100 px-4 sm:px-5">
              <div className="flex items-center justify-between gap-4 py-4 text-sm">
                <dt className="font-medium text-slate-600">Age</dt>
                <dd className="font-semibold text-slate-950">
                  {caseDetails.age}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4 text-sm">
                <dt className="font-medium text-slate-600">Gender</dt>
                <dd className="font-semibold text-slate-950">
                  {caseDetails.gender}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4 text-sm">
                <dt className="font-medium text-slate-600">Difficulty</dt>
                <dd>
                  <DifficultyBadge value={caseDetails.difficulty} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4 text-sm">
                <dt className="font-medium text-slate-600">Case ID</dt>
                <dd className="font-semibold text-slate-950">
                  {caseDetails.id}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-200 p-4 sm:p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <ShieldPlus className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-950">
                Case Actions
              </h2>
            </div>
            <div className="space-y-3 p-4 sm:p-5">
              <button
                type="button"
                onClick={() => toast.success("Note action selected.")}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <ClipboardEdit className="h-4 w-4" />
                Add Note
              </button>
              <button
                type="button"
                onClick={() => toast.success("Issue report action selected.")}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-red-300 bg-white text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Flag className="h-4 w-4" />
                Report Issue
              </button>
            </div>
          </section>
        </aside>

        <div className="space-y-6">
          <InfoCard icon={FileQuestion} title="History" tone="emerald">
            {caseDetails.history ? (
              <p>{caseDetails.history}</p>
            ) : (
              <EmptyDetail label="History" />
            )}
          </InfoCard>

          <InfoCard icon={Stethoscope} title="Examination" tone="amber">
            {caseDetails.examination ? (
              <p>{caseDetails.examination}</p>
            ) : (
              <EmptyDetail label="Examination" />
            )}
          </InfoCard>

          <InfoCard icon={HelpCircle} title="Questions" tone="blue">
            {caseDetails.questions.length ? (
              <ul className="space-y-1">
                {caseDetails.questions.map((question, index) => (
                  <li key={`${question}-${index}`} className="flex gap-2">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-700" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyDetail label="Questions" />
            )}
          </InfoCard>

          <InfoCard icon={Heart} title="Diagnosis" tone="purple">
            {caseDetails.diagnosis ? (
              <p>{caseDetails.diagnosis}</p>
            ) : (
              <EmptyDetail label="Diagnosis" />
            )}
          </InfoCard>
        </div>
      </section>
    </div>
  );
}
