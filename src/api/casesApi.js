import apiClient from './apiClient'

function unwrapListPayload(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  if (Array.isArray(payload?.cases)) {
    return payload.cases
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

function unwrapDetailPayload(payload) {
  if (payload?.case) {
    return payload.case
  }

  if (payload?.detail && typeof payload.detail === 'object') {
    return payload.detail
  }

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data
  }

  return payload
}

export async function getCasesRequest() {
  const response = await apiClient.get('/api/cases/')
  return unwrapListPayload(response.data)
}

export async function getCaseByIdRequest(caseId) {
  const response = await apiClient.get(`/api/cases/${caseId}/`)
  return unwrapDetailPayload(response.data)
}

export const getcasebyidRequest = getCaseByIdRequest
