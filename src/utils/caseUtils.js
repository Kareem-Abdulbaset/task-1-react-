import { formatRelativeDate } from "./dateUtils.js";

export function normalizeDifficulty(value) {
  const normalized = String(value || "Medium").trim().toLowerCase();

  if (normalized === "easy") {
    return "Easy";
  }

  if (normalized === "hard") {
    return "Hard";
  }

  return "Medium";
}

function titleCase(value) {
  if (!value) {
    return "";
  }

  const text = String(value);
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function getAgeLabel(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (typeof value === "number") {
    return `${value} years`;
  }

  const text = String(value);
  return text.toLowerCase().includes("year") ? text : `${text} years`;
}

function toQuestionList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return item?.text || item?.question || item?.title || "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim().replace(/^[-*]\s*/, ""))
      .filter(Boolean);
  }

  return [];
}

export function truncateText(value, maxLength = 62) {
  const text = String(value || "").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3).trim()}...`;
}

export function normalizeUser(rawUser) {
  const user = rawUser || {};
  const name =
    user.name ||
    user.full_name ||
    user.username ||
    user.email?.split("@")[0] ||
    "Demo Medical Student";

  return {
    id: user.id,
    name,
    firstName: String(name).split(" ")[0] || "Demo",
    email: user.email || "student@example.com",
    role: user.role || "student",
  };
}

export function normalizeCase(rawCase, index = 0) {
  const item = rawCase || {};
  const id = item.id ?? item.pk ?? item.case_id ?? item.uuid ?? index + 1;
  const title =
    item.title ||
    item.name ||
    item.case_title ||
    item.diagnosis ||
    "Untitled Medical Case";
  const complaint =
    item.complaint ||
    item.chief_complaint ||
    item.presenting_complaint ||
    item.description ||
    "";
  const gender = titleCase(item.gender || item.patient_gender);
  const age = getAgeLabel(item.age ?? item.patient_age);
  const difficulty = normalizeDifficulty(item.difficulty || item.level);
  const updatedAt =
    item.updated_at ||
    item.updatedAt ||
    item.created_at ||
    item.createdAt ||
    item.date;
  const questions = toQuestionList(item.questions || item.case_questions);
  const diagnosis = item.diagnosis || item.final_diagnosis || title;

  return {
    id,
    raw: item,
    title,
    complaint,
    complaintPreview: truncateText(complaint || "No complaint provided."),
    gender: gender || "Unknown",
    age: age || "Unknown age",
    patientLabel:
      gender && age ? `${gender}, ${age}` : gender || age || "Patient details",
    difficulty,
    updatedAt,
    updatedLabel: item.updated_label || formatRelativeDate(updatedAt),
    history: item.history || item.patient_history || item.story || "",
    examination:
      item.examination ||
      item.exam ||
      item.physical_examination ||
      item.physical_exam ||
      "",
    questions,
    diagnosis,
  };
}

export function getCaseStats(cases) {
  return cases.reduce(
    (stats, item) => {
      stats.total += 1;

      if (item.difficulty === "Easy") {
        stats.easy += 1;
      }

      if (item.difficulty === "Medium") {
        stats.medium += 1;
      }

      if (item.difficulty === "Hard") {
        stats.hard += 1;
      }

      return stats;
    },
    {
      total: 0,
      completed: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    },
  );
}
