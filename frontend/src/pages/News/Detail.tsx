import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Empty, Spin } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { newsService } from '@/services'
import type { News } from '@/types'
import { NEWS_CATEGORY_LABELS } from '@/types'

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return

      setLoading(true)
      try {
        const data = await newsService.getNewsById(parseInt(id))
        setNews(data)
      } catch (error) {
        console.error('获取新闻详情失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [id])

  if (loading) {
    return (
      <div className="news-detail-page">
        <Spin size="large" />
      </div>
    )
  }

  if (!news) {
    return (
      <div className="news-detail-page">
        <Empty description="新闻不存在" />
        <Button type="primary" onClick={() => navigate('/news')}>
          返回新闻列表
        </Button>
      </div>
    )
  }

  return (
    <div className="news-detail-page">
      <Card>
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => navigate('/news')}
          style={{ marginBottom: 16 }}
        >
          返回列表
        </Button>

        <div className="news-detail">
          <h1 className="news-title">{news.title}</h1>
          <div className="news-meta">
            <span className="meta-category">{NEWS_CATEGORY_LABELS[news.category]}</span>
            <span className="meta-date">
              发布时间：{news.publishTime
                ? new Date(news.publishTime).toLocaleString('zh-CN')
                : new Date(news.createdAt).toLocaleString('zh-CN')
              }
            </span>
          </div>

          {news.coverImage && (
            <img src={news.coverImage} alt={news.title} className="news-cover" />
          )}

          <div
            className="news-content"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </Card>
    </div>
  )
}

export default NewsDetail