import { normalizeDifficulty } from "../../utils/caseUtils.js";

const styles = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};

export default function DifficultyBadge({ value }) {
  const difficulty = normalizeDifficulty(value);

  return (
    <span
      className={[
        "inline-flex min-w-16 items-center justify-center rounded-md px-3 py-1 text-xs font-semibold",
        styles[difficulty],
      ].join(" ")}
    >
      {difficulty}
    </span>
  );
}
