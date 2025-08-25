const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface ApiResponse<T = any> {
  message?: string
  error?: {
    message: string
    status: number
  }
  data?: T
}

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
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string
    password: string
    fullName: string
    companyName?: string
  }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async getProfile() {
    return this.request("/auth/profile")
  }

  async updateProfile(profileData: { fullName?: string; companyName?: string }) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async logout() {
    return this.request("/auth/logout", { method: "POST" })
  }

  // Roles endpoints
  async getRoles(params?: {
    page?: number
    limit?: number
    status?: string
    department?: string
    employmentType?: string
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const query = searchParams.toString()
    return this.request(`/roles${query ? `?${query}` : ""}`)
  }

  async getRole(id: string) {
    return this.request(`/roles/${id}`)
  }

  async createRole(roleData: {
    title: string
    description: string
    requirements: string
    department: string
    location: string
    employmentType: string
    salaryRange?: string
  }) {
    return this.request("/roles", {
      method: "POST",
      body: JSON.stringify(roleData),
    })
  }

  async updateRole(
    id: string,
    roleData: Partial<{
      title: string
      description: string
      requirements: string
      department: string
      location: string
      employmentType: string
      salaryRange: string
      status: string
    }>,
  ) {
    return this.request(`/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(roleData),
    })
  }

  async deleteRole(id: string) {
    return this.request(`/roles/${id}`, { method: "DELETE" })
  }

  async getRoleApplications(
    roleId: string,
    params?: {
      page?: number
      limit?: number
      status?: string
      sortBy?: string
      sortOrder?: string
    },
  ) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const query = searchParams.toString()
    return this.request(`/roles/${roleId}/applications${query ? `?${query}` : ""}`)
  }

  // Applications endpoints
  async createApplication(formData: FormData) {
    return this.request("/applications", {
      method: "POST",
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    })
  }

  async getApplications(params?: {
    page?: number
    limit?: number
    status?: string
    jobRoleId?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const query = searchParams.toString()
    return this.request(`/applications${query ? `?${query}` : ""}`)
  }

  async getApplication(id: string) {
    return this.request(`/applications/${id}`)
  }

  async updateApplication(
    id: string,
    applicationData: {
      status?: string
      candidateName?: string
      candidatePhone?: string
    },
  ) {
    return this.request(`/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify(applicationData),
    })
  }

  async deleteApplication(id: string) {
    return this.request(`/applications/${id}`, { method: "DELETE" })
  }

  // Evaluations endpoints
  async getEvaluations(params?: {
    page?: number
    limit?: number
    jobRoleId?: string
    minScore?: number
    maxScore?: number
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const query = searchParams.toString()
    return this.request(`/evaluations${query ? `?${query}` : ""}`)
  }

  async getEvaluation(id: string) {
    return this.request(`/evaluations/${id}`)
  }

  async getApplicationEvaluations(applicationId: string) {
    return this.request(`/evaluations/application/${applicationId}`)
  }

  async reevaluateApplication(applicationId: string, customPrompt?: string) {
    return this.request("/evaluations/reevaluate", {
      method: "POST",
      body: JSON.stringify({ applicationId, customPrompt }),
    })
  }

  async getEvaluationStats(params?: {
    jobRoleId?: string
    period?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const query = searchParams.toString()
    return this.request(`/evaluations/stats${query ? `?${query}` : ""}`)
  }

  async deleteEvaluation(id: string) {
    return this.request(`/evaluations/${id}`, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
