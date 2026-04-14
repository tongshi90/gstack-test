import { useEffect, useState } from 'react'
import { Card, Row, Col, List, Button } from 'antd'
import { Link } from 'react-router-dom'
import { RightOutlined } from '@ant-design/icons'
import { newsService, announcementService } from '@/services'
import type { News, Announcement } from '@/types'
import { NEWS_CATEGORY_LABELS } from '@/types'

const Home = () => {
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsResponse = await newsService.getNewsList({ page: 1, pageSize: 4 })
        setLatestNews(newsResponse.data)

        const announcementResponse = await announcementService.getAnnouncementsList({ page: 1, pageSize: 5 })
        setPinnedAnnouncements(announcementResponse.data.filter(a => a.isPinned))
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>欢迎来到XX中学</h1>
          <p>培养德智体美劳全面发展的新时代人才</p>
          <Link to="/registration">
            <Button type="primary" size="large">
              立即报名
            </Button>
          </Link>
        </div>
      </section>

      <Row gutter={24} className="content-row">
        <Col xs={24} md={16}>
          <Card title="最新新闻" extra={<Link to="/news">更多 <RightOutlined /></Link>}>
            <List
              dataSource={latestNews}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/news/${item.id}`}>
                    <List.Item.Meta
                      title={item.title}
                      description={new Date(item.createdAt).toLocaleDateString('zh-CN')}
                    />
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="重要公告">
            <List
              dataSource={pinnedAnnouncements}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/announcements/${item.id}`}>
                    <List.Item.Meta title={item.title} />
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home