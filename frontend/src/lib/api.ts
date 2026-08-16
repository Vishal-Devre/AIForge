/**
 * API client for the AIForge backend.
 * Uses the Supabase access token from the auth context for authenticated requests.
 * Falls back gracefully when the backend is unavailable.
 */

import { supabase } from './supabase'
import type {
  Agent,
  AgentCreatePayload,
  AgentUpdatePayload,
  AgentListResponse,
} from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(errorBody.detail || `HTTP ${response.status}: ${response.statusText}`)
  }
  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }
  return response.json()
}

// ─── Agent API ───────────────────────────────────────────────────────────

export const agentsApi = {
  /** Fetch public (marketplace) agents — no auth required */
  async getPublic(skip = 0, limit = 50): Promise<AgentListResponse> {
    const headers = await getAuthHeaders()
    const response = await fetch(
      `${API_URL}/api/v1/agents/public?skip=${skip}&limit=${limit}`,
      { headers },
    )
    return handleResponse<AgentListResponse>(response)
  },

  /** Fetch the current user's agents — requires auth */
  async getMyAgents(
    skip = 0,
    limit = 50,
    statusFilter?: string,
  ): Promise<AgentListResponse> {
    const headers = await getAuthHeaders()
    let url = `${API_URL}/api/v1/agents?skip=${skip}&limit=${limit}`
    if (statusFilter) {
      url += `&status=${statusFilter}`
    }
    const response = await fetch(url, { headers })
    return handleResponse<AgentListResponse>(response)
  },

  /** Fetch a single agent by ID */
  async getById(id: string): Promise<Agent> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/agents/${id}`, { headers })
    return handleResponse<Agent>(response)
  },

  /** Create a new agent */
  async create(data: AgentCreatePayload): Promise<Agent> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/agents`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return handleResponse<Agent>(response)
  },

  /** Partial-update an existing agent */
  async update(id: string, data: AgentUpdatePayload): Promise<Agent> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/agents/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    })
    return handleResponse<Agent>(response)
  },

  /** Delete an agent */
  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/agents/${id}`, {
      method: 'DELETE',
      headers,
    })
    return handleResponse<void>(response)
  },
}
