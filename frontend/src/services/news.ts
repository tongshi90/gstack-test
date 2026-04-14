import axios from 'axios'
import type { News, PaginationResponse, NewsCategory } from '@/types'

const API_BASE = '/api'

export const newsService = {
  async getNewsList(params: {
    page?: number
    pageSize?: number
    category?: NewsCategory
    startDate?: string
    endDate?: string
  } = {}): Promise<PaginationResponse<News>> {
    const response = await axios.get<PaginationResponse<News>>(`${API_BASE}/news`, { params })
    return response.data
  },

  async getNewsById(id: number): Promise<News> {
    const response = await axios.get<News>(`${API_BASE}/news/${id}`)
    return response.data
  },

  async getNewsCategories(): Promise<NewsCategory[]> {
    const response = await axios.get<NewsCategory[]>(`${API_BASE}/news/categories`)
    return response.data
  },
}