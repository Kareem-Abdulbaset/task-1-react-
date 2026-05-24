import { formatRelativeDate } from './dateUtils'

export function titleCase(value) {
  if (!value) {
    return ''
  }

  const text = String(value)
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function normalizeDifficulty(value) {
  const normalized = String(value || 'medium').trim().toLowerCase()

  if (normalized === 'easy') {
    return 'Easy'
  }

  if (normalized === 'hard') {
    return 'Hard'
  }

  return 'Medium'
}

export function getAgeLabel(value) {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  if (typeof value === 'number') {
    return `${value} years`
  }

  const text = String(value).trim()
  return text.toLowerCase().includes('year') ? text : `${text} years`
}

export function truncateText(value, maxLength = 62) {
  const text = String(value || '').trim()

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 3).trim()}...`
}

function toQuestionList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') {
          return item
        }

        return item?.text || item?.question || item?.title || ''
      })
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|(?:\?\s*)/)
      .map((item) => item.trim().replace(/^[-*]\s*/, ''))
      .filter(Boolean)
      .map((item) => (item.endsWith('?') ? item : `${item}?`))
  }

  return []
}

export function normalizeUser(rawUser) {
  const user = rawUser?.user || rawUser?.data || rawUser || {}
  const name =
    user.name ||
    user.full_name ||
    user.fullName ||
    user.username ||
    user.email?.split('@')[0] ||
    'Demo Medical Student'

  return {
    id: user.id,
    name,
    firstName: String(name).split(' ')[0] || 'Demo',
    email: user.email || 'student@example.com',
    role: titleCase(user.role || user.user_type || 'student'),
    joinedAt: user.created_at || user.createdAt || user.date_joined || user.joined_at,
  }
}

export function normalizeCase(rawCase, index = 0) {
  const item = rawCase || {}
  const patient = item.patient || {}
  const id = item.id ?? item.pk ?? item.case_id ?? item.uuid ?? index + 1
  const title =
    item.title ||
    item.name ||
    item.case_title ||
    item.diagnosis ||
    item.final_diagnosis ||
    'Untitled Medical Case'
  const complaint =
    item.complaint ||
    item.chief_complaint ||
    item.presenting_complaint ||
    item.description ||
    item.summary ||
    ''
  const gender = titleCase(item.gender || item.patient_gender || patient.gender || 'Unknown')
  const age = getAgeLabel(item.age ?? item.patient_age ?? patient.age)
  const difficulty = normalizeDifficulty(item.difficulty || item.level || item.complexity)
  const updatedAt =
    item.updated_at ||
    item.updatedAt ||
    item.created_at ||
    item.createdAt ||
    item.date ||
    item.published_at
  const isCompleted = Boolean(
    item.completed ||
      item.is_completed ||
      item.completed_at ||
      String(item.status || '').toLowerCase() === 'completed',
  )
  const questions = toQuestionList(item.questions || item.case_questions || item.learning_questions)
  const history =
    item.history ||
    item.patient_history ||
    item.story ||
    item.history_of_present_illness ||
    item.hpi ||
    ''
  const examination =
    item.examination ||
    item.exam ||
    item.physical_examination ||
    item.physical_exam ||
    item.findings ||
    ''
  const diagnosis = item.diagnosis || item.final_diagnosis || item.answer || title

  return {
    id,
    raw: item,
    title,
    complaint,
    complaintPreview: truncateText(complaint || 'No complaint provided'),
    gender,
    age: age || 'Unknown age',
    patientLabel: `${gender}, ${age || 'Unknown age'}`,
    difficulty,
    updatedAt,
    updatedLabel: item.updated_label || item.updatedLabel || formatRelativeDate(updatedAt),
    isCompleted,
    history,
    examination,
    questions,
    diagnosis,
  }
}

export function getCaseStats(cases) {
  return cases.reduce(
    (stats, item) => {
      stats.total += 1

      if (item.isCompleted) {
        stats.completed += 1
      }

      if (item.difficulty === 'Easy') {
        stats.easy += 1
      }

      if (item.difficulty === 'Medium') {
        stats.medium += 1
      }

      if (item.difficulty === 'Hard') {
        stats.hard += 1
      }

      return stats
    },
    { total: 0, completed: 0, easy: 0, medium: 0, hard: 0 },
  )
}

export const getcasestatus = getCaseStats
