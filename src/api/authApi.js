import apiClient from './apiClient'

export async function loginRequest(credentials) {
  try {
    const response = await apiClient.post('/api/auth/login/', credentials)
    return response.data
  } catch (error) {
    if (![404, 405].includes(error.response?.status)) {
      throw error
    }

    const response = await apiClient.post('/api/auth/login', credentials)
    return response.data
  }
}

export async function getCurrentUser() {
  const response = await apiClient.get('/api/auth/me/')
  return response.data
}

export const loginrequest = loginRequest
export const getcurrentuser = getCurrentUser
