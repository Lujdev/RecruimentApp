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
      user: {
        id: string
        email: string
        profile: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: string
          company_name: string
          created_at: string
          updated_at: string
        }
      }
      session: {
        access_token: string
        refresh_token: string
        expires_at: number
      }
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: {
    email: string
    password: string
    fullName: string
    companyName?: string
  }) {
    return this.request<{
      message: string
      user: {
        id: string
        email: string
        emailConfirmed: boolean
      }
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async googleAuth(accessToken: string) {
    return this.request<{
      message: string
      user: {
        id: string
        email: string
        fullName: string
        role: string
      }
      session: {
        access_token: string
        refresh_token: string
        expires_in: number
      }
    }>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ access_token: accessToken }),
    })
  }

  async getProfile() {
    return this.request<{
      user: {
        id: string
        email: string
        fullName: string
        companyName: string
        role: string
        createdAt: string
      }
    }>("/api/auth/profile")
  }

  async updateProfile(profileData: {
    fullName?: string
    companyName?: string
  }) {
    return this.request<{
      message: string
      user: {
        id: string
        fullName: string
        companyName: string
        updatedAt: string
      }
    }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async logout() {
    return this.request<{
      message: string
    }>("/api/auth/logout", {
      method: "POST",
    })
  }

  // Roles endpoints - según APIDOC.md
  async getRoles(queryParams?: {
    page?: number
    limit?: number
    status?: string
    department?: string
    employmentType?: string
    search?: string
    createdBy?: string
  }) {
    const params = new URLSearchParams()
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString() ? `?${params.toString()}` : ''
    
    return this.request<{
      roles: Array<{
        id: string
        title: string
        description: string
        requirements: string
        department: string
        location: string
        employmentType: string
        salaryRange: string
        status: string
        createdAt: string
        createdBy: string
        creatorName: string
        applicationCount: number
      }>
      pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
      }
    }>(`/api/roles${queryString}`)
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

  async getRole(roleId: string) {
    return this.request<{
      role: {
        id: string
        title: string
        description: string
        requirements: string
        department: string
        location: string
        salaryRange: string
        employmentType: string
        experienceLevel: string
        skills: string[]
        benefits: string[]
        isActive: boolean
        createdAt: string
        updatedAt: string
        userId: string
        user: {
          id: string
          email: string
          profile: {
            full_name: string
            company_name: string
          }
        }
        _count: {
          applications: number
        }
      }
    }>(`/api/roles/${roleId}`)
  }

  async updateRole(roleId: string, roleData: {
    title?: string
    description?: string
    requirements?: string
    department?: string
    location?: string
    salaryRange?: string
    employmentType?: string
    experienceLevel?: string
    skills?: string[]
    benefits?: string[]
    isActive?: boolean
  }) {
    return this.request<{
      message: string
      role: {
        id: string
        title: string
        salaryRange: string
        updatedAt: string
      }
    }>(`/api/roles/${roleId}`, {
      method: "PUT",
      body: JSON.stringify(roleData),
    })
  }

  async deleteRole(roleId: string) {
    return this.request<{
      message: string
    }>(`/api/roles/${roleId}`, {
      method: "DELETE",
    })
  }

  async getRoleApplications(roleId: string, queryParams?: {
    page?: number
    limit?: number
    status?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const params = new URLSearchParams()
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString() ? `?${params.toString()}` : ''
    
    return this.request<{
      applications: Array<{
        id: string
        candidateName: string
        candidateEmail: string
        candidatePhone: string
        status: string
        appliedAt: string
        cvUrl: string
        hasEvaluation: boolean
        evaluationScore: number
      }>
      pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
      }
    }>(`/api/roles/${roleId}/applications${queryString}`)
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

  // Applications endpoints - según APIDOC.md
  async createApplication(formData: FormData) {
    return this.request<{
      message: string
      application: {
        id: string
        jobRoleId: string
        candidateName: string
        candidateEmail: string
        candidatePhone: string
        status: string
        cvUrl: string
        appliedAt: string
      }
      evaluation: {
        id: string
        score: number
        strengths: string[]
        weaknesses: string[]
        summary: string
        evaluatedAt: string
      }
    }>("/api/applications", {
      method: "POST",
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    })
  }

  async getApplications(queryParams?: {
    page?: number
    limit?: number
    status?: string
    jobRoleId?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const params = new URLSearchParams()
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString() ? `?${params.toString()}` : ''
    
    return this.request<{
      applications: Array<{
        id: string
        candidateName: string
        candidateEmail: string
        candidatePhone: string
        status: string
        appliedAt: string
        cvUrl: string
        jobRole: {
          id: string
          title: string
          department: string
        }
        evaluation: {
          id: string
          score: number
          evaluatedAt: string
        }
      }>
      pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
      }
    }>(`/api/applications${queryString}`)
  }

  async getApplication(applicationId: string) {
    return this.request<{
      application: {
        id: string
        candidateName: string
        candidateEmail: string
        candidatePhone: string
        status: string
        appliedAt: string
        updatedAt: string
        cvUrl: string
        cvText: string
        jobRole: {
          id: string
          title: string
          description: string
          requirements: string
          department: string
          location: string
        }
        evaluation: {
          id: string
          score: number
          strengths: string[]
          weaknesses: string[]
          summary: string
          evaluatedAt: string
        }
      }
    }>(`/api/applications/${applicationId}`)
  }

  async updateApplication(applicationId: string, applicationData: {
    status?: string
    candidateName?: string
    candidatePhone?: string
  }) {
    return this.request<{
      message: string
      application: {
        id: string
        status: string
        candidateName: string
        candidatePhone: string
        updatedAt: string
      }
    }>(`/api/applications/${applicationId}`, {
      method: "PUT",
      body: JSON.stringify(applicationData),
    })
  }

  async deleteApplication(applicationId: string) {
    return this.request<{
      message: string
    }>(`/api/applications/${applicationId}`, {
      method: "DELETE",
    })
  }

  // Evaluations endpoints - según APIDOC.md
  async getEvaluations(queryParams?: {
    page?: number
    limit?: number
    jobRoleId?: string
    minScore?: number
    maxScore?: number
    sortBy?: string
    sortOrder?: string
  }) {
    const params = new URLSearchParams()
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString() ? `?${params.toString()}` : ''
    
    return this.request<{
      evaluations: Array<{
        id: string
        score: number
        summary: string
        evaluatedAt: string
        application: {
          id: string
          candidateName: string
          candidateEmail: string
          status: string
        }
        jobRole: {
          id: string
          title: string
          department: string
        }
      }>
      pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
      }
    }>(`/api/evaluations${queryString}`)
  }

  async getEvaluation(evaluationId: string) {
    return this.request<{
      evaluation: {
        id: string
        score: number
        strengths: string[]
        weaknesses: string[]
        summary: string
        evaluatedAt: string
        application: {
          id: string
          candidateName: string
          candidateEmail: string
          candidatePhone: string
          status: string
          appliedAt: string
          cvUrl: string
        }
        jobRole: {
          id: string
          title: string
          description: string
          requirements: string
          department: string
          location: string
        }
      }
    }>(`/api/evaluations/${evaluationId}`)
  }

  async getEvaluationsByApplication(applicationId: string) {
    return this.request<{
      evaluations: Array<{
        id: string
        score: number
        summary: string
        evaluatedAt: string
      }>
      application: {
        id: string
        candidateName: string
        status: string
      }
    }>(`/api/evaluations/application/${applicationId}`)
  }

  async reevaluateApplication(evaluationData: {
    applicationId: string
    customPrompt?: string
  }) {
    return this.request<{
      message: string
      evaluation: {
        id: string
        score: number
        strengths: string[]
        weaknesses: string[]
        summary: string
        evaluatedAt: string
      }
    }>("/api/evaluations/reevaluate", {
      method: "POST",
      body: JSON.stringify(evaluationData),
    })
  }

  async getEvaluationStats(queryParams?: {
    jobRoleId?: string
    period?: string
  }) {
    const params = new URLSearchParams()
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString() ? `?${params.toString()}` : ''
    
    return this.request<{
      stats: {
        totalEvaluations: number
        averageScore: number
        scoreDistribution: {
          "0-20": number
          "21-40": number
          "41-60": number
          "61-80": number
          "81-100": number
        }
        topStrengths: Array<{
          strength: string
          count: number
        }>
        commonWeaknesses: Array<{
          weakness: string
          count: number
        }>
        evaluationsByPeriod: {
          thisWeek: number
          thisMonth: number
          thisQuarter: number
        }
      }
    }>(`/api/evaluations/stats${queryString}`)
  }

  async deleteEvaluation(evaluationId: string) {
    return this.request<{
      message: string
    }>(`/api/evaluations/${evaluationId}`, {
      method: "DELETE",
    })
  }

  // Dashboard endpoints - según APIDOC.md
  async getDashboardStats() {
    return this.request<{
      success: boolean
      data: {
        totalRoles: number
        totalCandidates: number
        averageScore: number
        pendingReviews: number
      }
    }>("/api/dashboard/stats")
  }

  async getDashboardActivity(queryParams?: {
    limit?: number
  }) {
    const params = new URLSearchParams()
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString() ? `?${params.toString()}` : ''
    
    return this.request<{
      success: boolean
      data: {
        activities: Array<{
          id: string
          type: string
          title: string
          description: string
          time: string
          score: number
        }>
      }
    }>(`/api/dashboard/activity${queryString}`)
  }

  async getDashboardAnalytics() {
    return this.request<{
      success: boolean
      data: {
        totalCandidates: number
        totalRoles: number
        averageScore: number
        topCandidates: Array<{
          id: string
          name: string
          email: string
          role_title: string
          score: number
          applied_at: string
        }>
        scoreDistribution: Array<{
          score_range: string
          count: number
        }>
        roleStats: Array<{
          id: string
          title: string
          applicationsCount: number
          avgScore: number
          status: string
        }>
        weeklyApplications: Array<{
          week: string
          count: number
        }>
      }
    }>("/api/dashboard/analytics")
  }

  // Candidates endpoints - según APIDOC.md
  async getCandidates(queryParams?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }) {
    const params = new URLSearchParams()
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString() ? `?${params.toString()}` : ''
    
    return this.request<{
      candidates: Array<{
        id: string
        name: string
        email: string
        phone?: string
        status: string
        appliedAt: string
        cvUrl: string
        jobRole: {
          id: string
          title: string
          department: string
        }
        evaluation?: {
          id: string
          score: number
          evaluatedAt: string
        }
      }>
      pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
      }
    }>(`/api/candidates${queryString}`)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
