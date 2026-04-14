import axios from 'axios'
import type { Announcement, PaginationResponse } from '@/types'

const API_BASE = '/api'

export const announcementService = {
  async getAnnouncementsList(params: {
    page?: number
    pageSize?: number
    startDate?: string
    endDate?: string
  } = {}): Promise<PaginationResponse<Announcement>> {
    const response = await axios.get<PaginationResponse<Announcement>>(`${API_BASE}/announcements`, { params })
    return response.data
  },

  async getAnnouncementById(id: number): Promise<Announcement> {
    const response = await axios.get<Announcement>(`${API_BASE}/announcements/${id}`)
    return response.data
  },
}