const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Auth endpoints - según APIDOC.md
  async login(credentials: { email: string; password: string }) {
    return this.request<{
      message: string
      token: string
      user: {
        id: number
        email: string
        name: string
        company: string
      }
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: {
    name: string
    email: string
    password: string
    company: string
  }) {
    return this.request<{
      message: string
      user: {
        id: number
        email: string
        name: string
        company: string
      }
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Roles endpoints - según APIDOC.md
  async getRoles() {
    return this.request<{
      roles: Array<{
        id: number
        title: string
        description: string
        requirements: string
        createdAt: string
        userId: number
      }>
    }>("/api/roles")
  }

  async createRole(roleData: {
    title: string
    description: string
    requirements: string
  }) {
    return this.request("/api/roles", {
      method: "POST",
      body: JSON.stringify(roleData),
    })
  }

  // Candidates endpoints - según APIDOC.md
  async getRoleCandidates(roleId: string) {
    return this.request<{
      candidates: Array<{
        id: number
        name: string
        email: string
        cvUrl: string
        score: number
        strengths: [string, string]
        weaknesses: [string, string]
        evaluation: string
        appliedAt: string
      }>
    }>(`/api/roles/${roleId}/candidates`)
  }

  async uploadCV(roleId: string, formData: FormData) {
    return this.request<{
      message: string
      candidate: {
        id: number
        name: string
        email: string
        score: number
        strengths: [string, string]
        weaknesses: [string, string]
        evaluation: string
      }
    }>(`/api/roles/${roleId}/candidates`, {
      method: "POST",
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    })
  }

  async getCandidate(candidateId: string) {
    return this.request<{
      candidate: {
        id: number
        name: string
        email: string
        cvUrl: string
        score: number
        strengths: [string, string]
        weaknesses: [string, string]
        evaluation: string
        roleTitle: string
        appliedAt: string
      }
    }>(`/api/candidates/${candidateId}`)
  }

  // Evaluation endpoint - según APIDOC.md
  async evaluateCV(evaluationData: {
    cvText: string
    roleDescription: string
    requirements: string
  }) {
    return this.request<{
      score: number
      strengths: [string, string]
      weaknesses: [string, string]
      evaluation: string
      reasoning: string
    }>("/api/evaluate-cv", {
      method: "POST",
      body: JSON.stringify(evaluationData),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
