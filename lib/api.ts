const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    console.log("[v0] Making API request to:", url)
    console.log("[v0] Request options:", { method: options.method || "GET", headers: options.headers })

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
      console.log("[v0] Sending fetch request...")
      const response = await fetch(url, config)
      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      let data
      try {
        data = await response.json()
        console.log("[v0] Response data:", data)
      } catch (jsonError) {
        console.error("[v0] Failed to parse JSON response:", jsonError)
        throw new Error(`Server returned non-JSON response. Status: ${response.status}`)
      }

      if (!response.ok) {
        console.error("[v0] API error response:", data)
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("[v0] API request failed:")
      console.error("[v0] URL:", url)
      console.error("[v0] Error:", error)

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          `Network error: Unable to connect to ${this.baseURL}. Please check if the server is running and accessible.`,
        )
      }

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
