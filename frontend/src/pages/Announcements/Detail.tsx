import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Empty, Spin, Tag } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { announcementService } from '@/services'
import type { Announcement } from '@/types'

const AnnouncementDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return

      setLoading(true)
      try {
        const data = await announcementService.getAnnouncementById(parseInt(id))
        setAnnouncement(data)
      } catch (error) {
        console.error('获取公告详情失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncement()
  }, [id])

  if (loading) {
    return (
      <div className="announcement-detail-page">
        <Spin size="large" />
      </div>
    )
  }

  if (!announcement) {
    return (
      <div className="announcement-detail-page">
        <Empty description="公告不存在" />
        <Button type="primary" onClick={() => navigate('/announcements')}>
          返回公告列表
        </Button>
      </div>
    )
  }

  return (
    <div className="announcement-detail-page">
      <Card>
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => navigate('/announcements')}
          style={{ marginBottom: 16 }}
        >
          返回列表
        </Button>

        <div className="announcement-detail">
          <h1 className="announcement-title">
            {announcement.isPinned && <Tag color="red" style={{ marginRight: 8 }}>置顶</Tag>}
            {announcement.title}
          </h1>
          <div className="announcement-meta">
            <span className="meta-date">
              发布时间：{announcement.publishTime
                ? new Date(announcement.publishTime).toLocaleString('zh-CN')
                : new Date(announcement.createdAt).toLocaleString('zh-CN')
              }
            </span>
          </div>

          <div
            className="announcement-content"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </div>
      </Card>
    </div>
  )
}

export default AnnouncementDetail