import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { List, Card, Select, Empty, Spin } from 'antd'
import { newsService } from '@/services'
import type { News, NewsCategory } from '@/types'
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS } from '@/types'
import Pagination from '@/components/Pagination'

const NewsList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [newsList, setNewsList] = useState<News[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const page = parseInt(searchParams.get('page') || '1')
  const category = searchParams.get('category') as NewsCategory | null

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const response = await newsService.getNewsList({
          page,
          pageSize: 10,
          category: category || undefined
        })
        setNewsList(response.data)
        setTotal(response.total)
      } catch (error) {
        console.error('获取新闻列表失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [page, category])

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), ...(category ? { category } : {}) })
  }

  const handleCategoryChange = (newCategory: NewsCategory | undefined) => {
    setSearchParams({ page: '1', ...(newCategory ? { category: newCategory } : {}) })
  }

  return (
    <div className="news-list-page">
      <Card title="新闻中心" extra={
        <Select
          placeholder="选择分类"
          style={{ width: 150 }}
          value={category || undefined}
          onChange={handleCategoryChange}
          allowClear
        >
          {NEWS_CATEGORIES.map(cat => (
            <Select.Option key={cat} value={cat}>
              {NEWS_CATEGORY_LABELS[cat]}
            </Select.Option>
          ))}
        </Select>
      }>
        <Spin spinning={loading}>
          {newsList.length === 0 && !loading ? (
            <Empty description="暂无新闻" />
          ) : (
            <List
              dataSource={newsList}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={`#/news/${item.id}`}>{item.title}</a>}
                    description={
                      <div>
                        <span className="news-category">{NEWS_CATEGORY_LABELS[item.category]}</span>
                        <span className="news-date">{new Date(item.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>

        {newsList.length > 0 && (
          <Pagination
            current={page}
            pageSize={10}
            total={total}
            onChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  )
}

export default NewsList