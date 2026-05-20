import {
  Activity,
  Brain,
  Droplet,
  HeartPulse,
  ShieldPlus,
  Stethoscope,
  Thermometer,
  Wind,
} from "lucide-react";

const visualMap = [
  {
    match: ["appendicitis", "asthma", "pneumonia"],
    icon: Wind,
    className: "bg-blue-100 text-blue-600",
  },
  {
    match: ["ketoacidosis", "diabetic"],
    icon: Droplet,
    className: "bg-violet-100 text-violet-600",
  },
  {
    match: ["myocardial", "heart"],
    icon: HeartPulse,
    className: "bg-red-100 text-red-600",
  },
  {
    match: ["urinary"],
    icon: ShieldPlus,
    className: "bg-teal-100 text-teal-600",
  },
  {
    match: ["gastro"],
    icon: Thermometer,
    className: "bg-pink-100 text-pink-600",
  },
  {
    match: ["migraine"],
    icon: Brain,
    className: "bg-purple-100 text-purple-600",
  },
  {
    match: ["cellulitis"],
    icon: Activity,
    className: "bg-emerald-100 text-emerald-600",
  },
];

export default function CaseIcon({ title, size = "md" }) {
  const normalizedTitle = String(title || "").toLowerCase();
  const visual =
    visualMap.find((item) =>
      item.match.some((keyword) => normalizedTitle.includes(keyword)),
    ) || {
      icon: Stethoscope,
      className: "bg-sky-100 text-sky-600",
    };
  const Icon = visual.icon;
  const sizeClass =
    size === "lg" ? "h-16 w-16 sm:h-20 sm:w-20" : "h-11 w-11 sm:h-12 sm:w-12";
  const iconSizeClass =
    size === "lg" ? "h-8 w-8 sm:h-10 sm:w-10" : "h-5 w-5 sm:h-6 sm:w-6";

  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center rounded-lg",
        sizeClass,
        visual.className,
      ].join(" ")}
    >
      <Icon className={iconSizeClass} strokeWidth={2.2} />
    </div>
  );
}
