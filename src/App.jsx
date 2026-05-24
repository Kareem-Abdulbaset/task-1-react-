import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BadgeHelp,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Droplet,
  Eye,
  EyeOff,
  FilePenLine,
  Filter,
  Flag,
  GraduationCap,
  HeartPulse,
  Home,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mail,
  MessageCircle,
  MoonStar,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Stethoscope,
  Syringe,
  TrendingUp,
  UserCheck,
  UserRound,
  X,
} from 'lucide-react'
import {
  Link,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom'
import { getApiErrorMessage } from './api/apiClient'
import { getCaseByIdRequest, getCasesRequest } from './api/casesApi'
import { useAuth } from './context/AuthContext'
import { getCaseStats, normalizeCase } from './utils/caseUtils'
import './App.css'

const caseVisuals = [
  { icon: Activity, tone: 'blue' },
  { icon: Activity, tone: 'green' },
  { icon: Droplet, tone: 'purple' },
  { icon: HeartPulse, tone: 'red' },
  { icon: Stethoscope, tone: 'amber' },
  { icon: Syringe, tone: 'teal' },
  { icon: RefreshCw, tone: 'pink' },
  { icon: BadgeHelp, tone: 'violet' },
  { icon: Activity, tone: 'green' },
]

const defaultQuestions = [
  'What is the most likely diagnosis?',
  'What investigations would you order?',
  'What is the initial management?',
  'What are possible complications?',
]

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />}
      />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:caseId" element={<CaseDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
    </Routes>
  )
}

function RequireAuth() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const casesData = useCasesData()
  const [globalQuery, setGlobalQuery] = useState('')

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard-shell">
      <Sidebar onLogout={handleLogout} />
      <main className="main-area">
        <Topbar user={user} query={globalQuery} onQueryChange={setGlobalQuery} />
        <Outlet
          context={{
            ...casesData,
            globalQuery,
            user,
            logout: handleLogout,
          }}
        />
      </main>
    </div>
  )
}

function useCasesData() {
  const [cases, setCases] = useState([])
  const [isCasesLoading, setIsCasesLoading] = useState(true)
  const [casesError, setCasesError] = useState('')

  const loadCases = useCallback(async () => {
    setIsCasesLoading(true)
    setCasesError('')

    try {
      const payload = await getCasesRequest()
      setCases(payload.map((item, index) => normalizeCase(item, index)))
    } catch (error) {
      setCases([])
      setCasesError(getApiErrorMessage(error))
    } finally {
      setIsCasesLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadCases()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadCases])

  return { cases, isCasesLoading, casesError, refreshCases: loadCases }
}

function useAppData() {
  return useOutletContext()
}

function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <Link className="brand" to="/home">
        <span className="brand-mark" aria-hidden="true">
          <Stethoscope size={34} strokeWidth={2.1} />
        </span>
        <span>MedCases</span>
      </Link>

      <nav className="nav-list">
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/home">
          <Home size={22} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/cases">
          <ClipboardList size={22} />
          <span>Medical Cases</span>
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/profile">
          <UserRound size={22} />
          <span>Profile</span>
        </NavLink>
      </nav>

      <button className="nav-link logout-link" type="button" onClick={onLogout}>
        <LogOut size={22} />
        <span>Logout</span>
      </button>
    </aside>
  )
}

function Topbar({ user, query, onQueryChange }) {
  return (
    <header className="topbar">
      <label className="search-box">
        <Search size={20} />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search cases by title or complaint..."
        />
        <kbd>⌘ K</kbd>
      </label>

      <div className="topbar-actions">
        <button className="icon-button notification-button" type="button" aria-label="Notifications">
          <Bell size={22} />
          <span>2</span>
        </button>
        <button className="icon-button" type="button" aria-label="Toggle theme">
          <MoonStar size={22} />
        </button>
        <Link className="account-menu" to="/profile">
          <Avatar size="small" />
          <span>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </span>
          <ChevronDown size={18} />
        </Link>
      </div>
    </header>
  )
}

function DashboardPage() {
  const { cases, isCasesLoading, casesError, globalQuery, user } = useAppData()
  const stats = useMemo(() => getCaseStats(cases), [cases])
  const recentCases = useMemo(() => filterCases(cases, globalQuery).slice(0, 5), [cases, globalQuery])

  const statCards = [
    {
      label: 'Total Cases',
      value: stats.total,
      detail: 'Loaded medical cases',
      icon: ClipboardList,
      tone: 'blue',
    },
    {
      label: 'Cases Completed',
      value: stats.completed,
      detail: 'Keep learning!',
      icon: CircleCheck,
      tone: 'green',
    },
    {
      label: 'Easy Cases',
      value: stats.easy,
      detail: 'Start with these',
      icon: TrendingUp,
      tone: 'amber',
    },
    {
      label: 'Hard Cases',
      value: stats.hard,
      detail: 'Challenge yourself',
      icon: BarChart3,
      tone: 'purple',
    },
  ]

  return (
    <section className="content-wrap dashboard-content">
      <div className="welcome-block">
        <h1>
          Welcome back, <span>{user.firstName}!</span>
        </h1>
        <p>Here's what's happening with your medical cases dashboard today.</p>
      </div>

      <section className="stats-grid" aria-label="Dashboard statistics">
        {statCards.map((item) => (
          <StatCard key={item.label} item={item} isLoading={isCasesLoading} />
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="left-column">
          <section className="panel recent-cases" aria-labelledby="recent-cases-title">
            <div className="panel-header">
              <h2 id="recent-cases-title">Recent Cases</h2>
              <Link to="/cases">
                View all cases
                <ChevronRight size={18} />
              </Link>
            </div>

            <CompactCasesTable
              cases={recentCases}
              isLoading={isCasesLoading}
              error={casesError}
              emptyMessage={
                globalQuery ? 'No cases match your search.' : 'No medical cases were returned.'
              }
            />

            <div className="panel-footer">
              <Link to="/cases" className="outline-button wide-button">
                Browse all medical cases
              </Link>
            </div>
          </section>

          <section className="learning-banner" aria-label="Learning reminder">
            <div className="banner-icon">
              <GraduationCap size={28} />
            </div>
            <div>
              <h2>Keep Learning, Keep Growing!</h2>
              <p>
                Review cases regularly and challenge yourself with harder cases to improve your
                clinical reasoning.
              </p>
            </div>
            <Link to="/cases" className="outline-button">
              Start Learning
            </Link>
          </section>
        </div>

        <aside className="right-column">
          <ProfileSummaryCard />
          <QuickActionsCard />
        </aside>
      </section>
    </section>
  )
}

function CasesPage() {
  const { cases, isCasesLoading, casesError, refreshCases, globalQuery } = useAppData()
  const [caseQuery, setCaseQuery] = useState('')
  const [difficulty, setDifficulty] = useState('All Difficulties')
  const activeQuery = caseQuery || globalQuery

  const filteredCases = useMemo(() => {
    return filterCases(cases, activeQuery).filter((item) => {
      return difficulty === 'All Difficulties' || item.difficulty === difficulty
    })
  }, [cases, activeQuery, difficulty])

  function clearFilters() {
    setCaseQuery('')
    setDifficulty('All Difficulties')
  }

  return (
    <section className="content-wrap cases-page">
      <div className="page-heading-row">
        <div>
          <h1>Medical Cases</h1>
          <p>Browse and explore all seeded medical cases.</p>
        </div>
        <button type="button" className="outline-button refresh-button" onClick={refreshCases}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="filters-row">
        <label className="filter-search">
          <Search size={19} />
          <input
            type="search"
            value={caseQuery}
            onChange={(event) => setCaseQuery(event.target.value)}
            placeholder="Search by title or complaint..."
          />
        </label>
        <label className="select-filter">
          <Filter size={18} />
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option>All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>
        <span className="case-count">{filteredCases.length} cases found</span>
        <button type="button" className="clear-button" onClick={clearFilters}>
          Clear Filters
          <X size={17} />
        </button>
      </div>

      <section className="panel all-cases-panel">
        <FullCasesTable
          cases={filteredCases}
          isLoading={isCasesLoading}
          error={casesError}
          emptyMessage={activeQuery ? 'No cases match your filters.' : 'No medical cases were returned.'}
        />
      </section>

      <div className="pagination-row">
        <span>
          Showing {filteredCases.length ? 1 : 0} to {filteredCases.length} of {filteredCases.length}{' '}
          cases
        </span>
        <div className="pagination-buttons">
          <button type="button" disabled>
            <ChevronRight size={18} className="flip-icon" />
          </button>
          <button type="button" className="active">
            1
          </button>
          <button type="button" disabled>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

function CaseDetailsPage() {
  const { caseId } = useParams()
  const { cases } = useAppData()
  const existingCase = useMemo(() => {
    return cases.find((item) => String(item.id) === caseId)
  }, [caseId, cases])
  const [fetchedCase, setFetchedCase] = useState({ caseId: null, item: null })
  const [isLoading, setIsLoading] = useState(!existingCase)
  const [error, setError] = useState('')
  const caseItem = existingCase || (fetchedCase.caseId === caseId ? fetchedCase.item : null)

  useEffect(() => {
    if (existingCase) {
      return
    }

    let ignore = false
    const timer = window.setTimeout(() => {
      async function loadCase() {
        setIsLoading(true)
        setError('')

        try {
          const payload = await getCaseByIdRequest(caseId)

          if (!ignore) {
            setFetchedCase({ caseId, item: normalizeCase(payload, Number(caseId) - 1 || 0) })
          }
        } catch (requestError) {
          if (!ignore) {
            setError(getApiErrorMessage(requestError))
          }
        } finally {
          if (!ignore) {
            setIsLoading(false)
          }
        }
      }

      loadCase()
    }, 0)

    return () => {
      ignore = true
      window.clearTimeout(timer)
    }
  }, [caseId, existingCase])

  if (!caseItem && isLoading) {
    return (
      <section className="content-wrap case-details-page">
        <Link className="back-link" to="/cases">
          <ArrowLeft size={18} />
          Back to Cases
        </Link>
        <div className="panel detail-loading">
          <TableState type="loading" />
        </div>
      </section>
    )
  }

  if (error || !caseItem) {
    return (
      <section className="content-wrap case-details-page">
        <Link className="back-link" to="/cases">
          <ArrowLeft size={18} />
          Back to Cases
        </Link>
        <div className="panel detail-loading">
          <TableState type="error" message={error || 'Case was not found.'} />
        </div>
      </section>
    )
  }

  const visual = getCaseVisual(caseItem, Number(caseId) - 1)
  const questions = caseItem.questions.length ? caseItem.questions : defaultQuestions

  return (
    <section className="content-wrap case-details-page">
      <Link className="back-link" to="/cases">
        <ArrowLeft size={18} />
        Back to Cases
      </Link>

      <section className="panel case-hero-card">
        <span className={`detail-case-icon tone-${visual.tone}`}>
          <visual.icon size={54} strokeWidth={2} />
        </span>
        <div>
          <h1>{caseItem.title}</h1>
          <div className="detail-badges">
            <span>
              <UserRound size={18} />
              {caseItem.patientLabel}
            </span>
            <span>
              <CalendarDays size={18} />
              {caseItem.updatedLabel}
            </span>
            <DifficultyBadge difficulty={caseItem.difficulty} />
          </div>
        </div>
        <button type="button" className="primary-button favorite-button">
          <Star size={18} />
          Add to Favorites
        </button>
      </section>

      <section className="case-detail-grid">
        <aside className="detail-side">
          <InfoCard
            icon={MessageCircle}
            tone="purple"
            title="Chief Complaint"
            body={caseItem.complaint || 'No complaint was provided.'}
          />

          <section className="detail-card patient-card">
            <CardTitle icon={UserRound} tone="blue" title="Patient Information" />
            <dl>
              <div>
                <dt>Age</dt>
                <dd>{caseItem.age}</dd>
              </div>
              <div>
                <dt>Gender</dt>
                <dd>{caseItem.gender}</dd>
              </div>
              <div>
                <dt>Difficulty</dt>
                <dd>
                  <DifficultyBadge difficulty={caseItem.difficulty} />
                </dd>
              </div>
              <div>
                <dt>Case ID</dt>
                <dd>{caseItem.id}</dd>
              </div>
            </dl>
          </section>

          <section className="detail-card actions-card">
            <CardTitle icon={BadgeCheck} tone="green" title="Case Actions" />
            <button type="button" className="wide-action-button">
              <FilePenLine size={18} />
              Add Note
            </button>
            <button type="button" className="wide-action-button danger">
              <Flag size={18} />
              Report Issue
            </button>
          </section>
        </aside>

        <div className="detail-main">
          <InfoCard
            icon={BookOpen}
            tone="green"
            title="History"
            body={caseItem.history || 'No history was provided for this case.'}
          />
          <InfoCard
            icon={Stethoscope}
            tone="amber"
            title="Examination"
            body={caseItem.examination || 'No examination details were provided.'}
          />
          <section className="detail-card questions-card">
            <CardTitle icon={BadgeHelp} tone="blue" title="Questions" />
            <ul>
              {questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </section>
          <InfoCard
            icon={BadgeCheck}
            tone="purple"
            title="Diagnosis"
            body={caseItem.diagnosis || caseItem.title}
          />
        </div>
      </section>
    </section>
  )
}

function ProfilePage() {
  const { user, cases, logout } = useAppData()
  const navigate = useNavigate()
  const stats = useMemo(() => getCaseStats(cases), [cases])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <section className="content-wrap profile-page">
      <div className="page-heading-row">
        <div>
          <h1>Your Profile</h1>
          <p>Review your account information and learning activity.</p>
        </div>
      </div>

      <section className="panel profile-hero-panel">
        <Avatar size="xl" />
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span>{user.role.toLowerCase()}</span>
        </div>
        <button type="button" className="outline-button">
          <FilePenLine size={17} />
          Edit Profile
        </button>
      </section>

      <section className="profile-grid">
        <section className="detail-card">
          <CardTitle icon={UserCheck} tone="blue" title="Account Details" />
          <dl className="profile-detail-list">
            <div>
              <dt>Full name</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{user.role === 'Student' ? 'Medical Student' : user.role}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>{formatMemberSince(user.joinedAt)}</dd>
            </div>
          </dl>
        </section>

        <section className="detail-card">
          <CardTitle icon={GraduationCap} tone="green" title="Learning Summary" />
          <div className="profile-stat-list">
            <ProfileStat label="Total Cases" value={stats.total} />
            <ProfileStat label="Completed" value={stats.completed} />
            <ProfileStat label="Hard Cases" value={stats.hard} />
          </div>
        </section>

        <section className="detail-card">
          <CardTitle icon={ShieldCheck} tone="purple" title="Security" />
          <p className="muted-copy">
            Your session token is stored locally and sent to the API as a bearer token.
          </p>
          <button type="button" className="wide-action-button">
            <KeyRound size={18} />
            Change Password
          </button>
        </section>

        <section className="detail-card">
          <CardTitle icon={LogOut} tone="red" title="Session" />
          <p className="muted-copy">Sign out from this browser and return to the login page.</p>
          <button type="button" className="wide-action-button danger" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </section>
      </section>
    </section>
  )
}

function LoginPage() {
  const { login, getApiErrorMessage: getAuthErrorMessage } = useAuth()
  const navigate = useNavigate()
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await login({
        email: identity,
        username: identity,
        password,
      })
      navigate('/home', { replace: true })
    } catch (requestError) {
      setError(requestError.response ? getAuthErrorMessage(requestError) : requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <Link className="brand login-brand" to="/login">
          <span className="brand-mark" aria-hidden="true">
            <Stethoscope size={40} strokeWidth={2.1} />
          </span>
          <span>MedCases</span>
        </Link>
        <div>
          <h1>Clinical cases, organized for practice.</h1>
          <p>Sign in to browse medical cases, review details, and continue your learning.</p>
        </div>
        <div className="login-feature-list">
          <span>
            <CircleCheck size={18} />
            Case dashboard
          </span>
          <span>
            <CircleCheck size={18} />
            Difficulty filters
          </span>
          <span>
            <CircleCheck size={18} />
            Patient summaries
          </span>
        </div>
      </section>

      <section className="login-form-wrap">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-heading">
            <span className="login-icon">
              <LockKeyhole size={26} />
            </span>
            <h2>Welcome back</h2>
            <p>Use your medical student account to continue.</p>
          </div>

          {error ? (
            <div className="form-error" role="alert">
              <AlertCircle size={18} />
              {error}
            </div>
          ) : null}

          <label className="form-field">
            <span>Email or username</span>
            <span className="field-control">
              <Mail size={19} />
              <input
                value={identity}
                onChange={(event) => setIdentity(event.target.value)}
                type="text"
                placeholder="student@example.com"
                autoComplete="username"
                required
              />
            </span>
          </label>

          <label className="form-field">
            <span>Password</span>
            <span className="field-control">
              <KeyRound size={19} />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="field-icon-button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          <div className="login-options-row">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#forgot">Forgot password?</a>
          </div>

          <button type="submit" className="primary-button login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
            <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  )
}

function ProfileSummaryCard() {
  const { user } = useAppData()

  return (
    <section className="panel profile-card" aria-labelledby="profile-title">
      <div className="panel-header">
        <h2 id="profile-title">Your Profile</h2>
      </div>
      <div className="profile-summary">
        <Avatar />
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span>{user.role.toLowerCase()}</span>
        </div>
      </div>
      <dl className="profile-meta">
        <div>
          <dt>Role</dt>
          <dd>{user.role === 'Student' ? 'Medical Student' : user.role}</dd>
        </div>
        <div>
          <dt>Member since</dt>
          <dd>{formatMemberSince(user.joinedAt)}</dd>
        </div>
      </dl>
    </section>
  )
}

function QuickActionsCard() {
  const { logout } = useAppData()

  return (
    <section className="panel quick-card" aria-labelledby="actions-title">
      <div className="panel-header">
        <h2 id="actions-title">Quick Actions</h2>
      </div>
      <div className="quick-list">
        <QuickAction to="/cases" label="Browse All Cases" detail="Explore all medical cases" icon={ClipboardList} tone="blue" />
        <QuickAction to="/profile" label="View Profile" detail="See your account details" icon={UserRound} tone="blue" />
        <QuickAction asButton onClick={logout} label="Logout" detail="Sign out of your account" icon={LogOut} tone="red" />
      </div>
    </section>
  )
}

function CompactCasesTable({ cases, isLoading, error, emptyMessage }) {
  return (
    <div className="cases-table compact-table" role="table" aria-label="Recent medical cases">
      <div className="table-row table-head" role="row">
        <span role="columnheader">Case Title</span>
        <span role="columnheader">Patient</span>
        <span role="columnheader">Difficulty</span>
        <span role="columnheader">Updated</span>
        <span role="columnheader" aria-label="Actions"></span>
      </div>

      {isLoading ? (
        <TableState type="loading" />
      ) : error ? (
        <TableState type="error" message={error} />
      ) : cases.length ? (
        cases.map((item, index) => <CompactCaseRow key={item.id} item={item} index={index} />)
      ) : (
        <TableState type="empty" message={emptyMessage} />
      )}
    </div>
  )
}

function FullCasesTable({ cases, isLoading, error, emptyMessage }) {
  return (
    <div className="cases-table full-table" role="table" aria-label="Medical cases">
      <div className="table-row full-table-row table-head" role="row">
        <span role="columnheader">Case</span>
        <span role="columnheader">Patient</span>
        <span role="columnheader">Difficulty</span>
        <span role="columnheader">Updated</span>
        <span role="columnheader">Action</span>
      </div>

      {isLoading ? (
        <TableState type="loading" />
      ) : error ? (
        <TableState type="error" message={error} />
      ) : cases.length ? (
        cases.map((item, index) => <FullCaseRow key={item.id} item={item} index={index} />)
      ) : (
        <TableState type="empty" message={emptyMessage} />
      )}
    </div>
  )
}

function CompactCaseRow({ item, index }) {
  const visual = getCaseVisual(item, index)

  return (
    <div className="table-row" role="row">
      <span className="case-title-cell" role="cell">
        <span className={`case-icon tone-${visual.tone}`}>
          <visual.icon size={20} strokeWidth={2.2} />
        </span>
        <span>
          <strong>{item.title}</strong>
          <small>Complaint: {item.complaintPreview}</small>
        </span>
      </span>
      <span role="cell">{item.patientLabel}</span>
      <span role="cell">
        <DifficultyBadge difficulty={item.difficulty} />
      </span>
      <span role="cell">{item.updatedLabel}</span>
      <span role="cell">
        <Link to={`/cases/${item.id}`} className="outline-button case-button">
          View Case
        </Link>
      </span>
    </div>
  )
}

function FullCaseRow({ item, index }) {
  const visual = getCaseVisual(item, index)

  return (
    <div className="table-row full-table-row" role="row">
      <span className="case-title-cell" role="cell">
        <span className={`case-icon large tone-${visual.tone}`}>
          <visual.icon size={27} strokeWidth={2.2} />
        </span>
        <span>
          <strong>{item.title}</strong>
          <small>Complaint: {item.complaintPreview}</small>
        </span>
      </span>
      <span className="icon-data-cell" role="cell">
        <UserRound size={17} />
        {item.patientLabel}
      </span>
      <span role="cell">
        <DifficultyBadge difficulty={item.difficulty} />
      </span>
      <span className="icon-data-cell" role="cell">
        <CalendarDays size={16} />
        {item.updatedLabel}
      </span>
      <span role="cell">
        <Link to={`/cases/${item.id}`} className="outline-button full-case-button">
          View Case
          <ArrowRight size={16} />
        </Link>
      </span>
    </div>
  )
}

function StatCard({ item, isLoading }) {
  const Icon = item.icon

  return (
    <article className={`stat-card tone-${item.tone}`}>
      <div className="stat-icon">
        <Icon size={34} strokeWidth={2.1} />
      </div>
      <div>
        <strong className={isLoading ? 'loading-number' : ''}>{isLoading ? '' : item.value}</strong>
        <span>{item.label}</span>
        <p>{item.detail}</p>
      </div>
    </article>
  )
}

function DifficultyBadge({ difficulty }) {
  return <span className={`difficulty-badge ${difficulty.toLowerCase()}`}>{difficulty}</span>
}

function TableState({ type, message }) {
  const isLoading = type === 'loading'
  const Icon = type === 'error' ? AlertCircle : RefreshCw

  return (
    <div className={`table-state ${type}`} role="row">
      <span role="cell">
        {isLoading ? (
          <>
            <span className="skeleton-line wide"></span>
            <span className="skeleton-line"></span>
            <span className="skeleton-line long"></span>
          </>
        ) : (
          <>
            <Icon size={24} />
            <strong>{type === 'error' ? 'Unable to load cases' : 'No cases found'}</strong>
            <small>{message}</small>
          </>
        )}
      </span>
    </div>
  )
}

function QuickAction({ label, detail, icon: Icon, tone, to, asButton = false, onClick }) {
  const content = (
    <>
      <span className={`quick-icon tone-${tone}`}>
        <Icon size={20} />
      </span>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <ChevronRight size={22} />
    </>
  )

  if (asButton) {
    return (
      <button type="button" className="quick-action" onClick={onClick}>
        {content}
      </button>
    )
  }

  return (
    <Link className="quick-action" to={to}>
      {content}
    </Link>
  )
}

function InfoCard({ icon, tone, title, body }) {
  return (
    <section className="detail-card">
      <CardTitle icon={icon} tone={tone} title={title} />
      <p>{body}</p>
    </section>
  )
}

function CardTitle({ icon: Icon, tone, title }) {
  return (
    <h2 className="card-title">
      <span className={`small-round-icon tone-${tone}`}>
        <Icon size={19} />
      </span>
      {title}
    </h2>
  )
}

function ProfileStat({ label, value }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function Avatar({ size = 'large' }) {
  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      <span className="avatar-hair"></span>
      <span className="avatar-face">
        <span className="avatar-eye left"></span>
        <span className="avatar-eye right"></span>
        <span className="avatar-smile"></span>
      </span>
      <span className="avatar-coat"></span>
    </span>
  )
}

function getCaseVisual(item, index = 0) {
  const visualIndex = Number.isFinite(Number(item.id)) ? Number(item.id) - 1 : index
  return caseVisuals[Math.abs(visualIndex) % caseVisuals.length]
}

function filterCases(cases, query) {
  const needle = query.trim().toLowerCase()

  if (!needle) {
    return cases
  }

  return cases.filter((item) =>
    [item.title, item.complaint, item.difficulty, item.patientLabel]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  )
}

function formatMemberSince(value) {
  if (!value) {
    return 'May 2024'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export default App
