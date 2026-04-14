import { useState } from 'react'
import { Card, Table, Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const AnnouncementsManage = () => {
  const [announcements, setAnnouncements] = useState([])

  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '是否置顶', dataIndex: 'isPinned', key: 'isPinned' },
    { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      )
    },
  ]

  return (
    <div className="admin-announcements-page">
      <Card
        title="公告管理"
        extra={<Button type="primary">新增公告</Button>}
      >
        <Table
          columns={columns}
          dataSource={announcements}
          rowKey="id"
          bordered
        />
      </Card>
    </div>
  )
}

export default AnnouncementsManage