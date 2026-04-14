import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { List, Card, Tag, Empty, Spin } from 'antd'
import { announcementService } from '@/services'
import type { Announcement } from '@/types'
import Pagination from '@/components/Pagination'

const AnnouncementsList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true)
      try {
        const response = await announcementService.getAnnouncementsList({ page, pageSize: 10 })
        setAnnouncements(response.data)
        setTotal(response.total)
      } catch (error) {
        console.error('获取公告列表失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [page])

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() })
  }

  return (
    <div className="announcements-list-page">
      <Card title="通知公告">
        <Spin spinning={loading}>
          {announcements.length === 0 && !loading ? (
            <Empty description="暂无公告" />
          ) : (
            <List
              dataSource={announcements}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <span>
                        {item.isPinned && <Tag color="red">置顶</Tag>}
                        <a href={`#/announcements/${item.id}`}>{item.title}</a>
                      </span>
                    }
                    description={
                      <span className="announcement-date">
                        发布时间：{item.publishTime
                          ? new Date(item.publishTime).toLocaleDateString('zh-CN')
                          : new Date(item.createdAt).toLocaleDateString('zh-CN')
                        }
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>

        {announcements.length > 0 && (
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

export default AnnouncementsList