import axios from 'axios'
import type { Registration, StudentInfo, ParentsInfo } from '@/types'

const API_BASE = '/api'

export const registrationService = {
  async saveDraft(data: {
    registrationNumber?: string
    student: StudentInfo
    parents: ParentsInfo
  }): Promise<{ registrationNumber: string }> {
    const response = await axios.post(`${API_BASE}/registrations/draft`, data)
    return response.data
  },

  async submitRegistration(data: {
    registrationNumber?: string
    student: StudentInfo
    parents: ParentsInfo
  }): Promise<{ registrationNumber: string }> {
    const response = await axios.post(`${API_BASE}/registrations`, data)
    return response.data
  },

  async getRegistration(registrationNumber: string): Promise<Registration> {
    const response = await axios.get<Registration>(`${API_BASE}/registrations/${registrationNumber}`)
    return response.data
  },

  async updateRegistration(
    registrationNumber: string,
    data: {
      student?: StudentInfo
      parents?: ParentsInfo
    }
  ): Promise<Registration> {
    const response = await axios.put<Registration>(`${API_BASE}/registrations/${registrationNumber}`, data)
    return response.data
  },
}