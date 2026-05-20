import { UserRound } from "lucide-react";

const sizes = {
  sm: "h-10 w-10",
  md: "h-10 w-10 sm:h-12 sm:w-12",
  lg: "h-20 w-20",
  xl: "h-28 w-28 sm:h-36 sm:w-36 xl:h-40 xl:w-40",
};

const iconSizes = {
  sm: "h-5 w-5",
  md: "h-5 w-5 sm:h-6 sm:w-6",
  lg: "h-10 w-10",
  xl: "h-14 w-14 sm:h-16 sm:w-16 xl:h-20 xl:w-20",
};

export default function Avatar({ name, size = "md" }) {
  const label = name || "Demo Medical Student";

  return (
    <div
      aria-label={label}
      className={[
        "flex shrink-0 items-center justify-center rounded-full border border-blue-100 bg-gradient-to-br from-blue-100 to-blue-500 text-white shadow-sm",
        sizes[size] || sizes.md,
      ].join(" ")}
    >
      <UserRound className={iconSizes[size] || iconSizes.md} />
    </div>
  );
}
