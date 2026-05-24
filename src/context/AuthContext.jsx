/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, loginRequest } from '../api/authApi'
import { getApiErrorMessage, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../api/apiClient'
import { normalizeUser } from '../utils/caseUtils'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY)
    return rawUser ? normalizeUser(JSON.parse(rawUser)) : normalizeUser()
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return normalizeUser()
  }
}

function getTokenFromPayload(payload) {
  return (
    payload?.token ||
    payload?.access ||
    payload?.access_token ||
    payload?.key ||
    payload?.data?.token ||
    payload?.data?.access ||
    payload?.data?.access_token
  )
}

function getUserFromPayload(payload) {
  return payload?.user || payload?.profile || payload?.data?.user || payload?.data?.profile || null
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [user, setUser] = useState(() => readStoredUser())
  const [isUserLoading, setIsUserLoading] = useState(Boolean(token))

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(null)
    setUser(normalizeUser())
  }, [])

  const login = useCallback(async (credentials) => {
    const payload = await loginRequest(credentials)
    const nextToken = getTokenFromPayload(payload)
    const payloadUser = getUserFromPayload(payload)

    if (!nextToken) {
      throw new Error('Login succeeded, but no token was returned by the API.')
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    setToken(nextToken)

    if (payloadUser) {
      const nextUser = normalizeUser(payloadUser)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
    }

    return payload
  }, [])

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      return null
    }

    setIsUserLoading(true)

    try {
      const nextUser = normalizeUser(await getCurrentUser())
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
      return nextUser
    } finally {
      setIsUserLoading(false)
    }
  }, [])

  useEffect(() => {
    function handleAuthExpired() {
      clearSession()
    }

    window.addEventListener('auth:expired', handleAuthExpired)
    return () => window.removeEventListener('auth:expired', handleAuthExpired)
  }, [clearSession])

  useEffect(() => {
    let timer

    if (!token) {
      timer = window.setTimeout(() => setIsUserLoading(false), 0)
      return () => window.clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      refreshUser().catch(() => {
        clearSession()
      })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [token, refreshUser, clearSession])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isUserLoading,
      login,
      logout: clearSession,
      refreshUser,
      getApiErrorMessage,
    }),
    [token, user, isUserLoading, login, clearSession, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
