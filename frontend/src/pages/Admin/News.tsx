import { useState } from 'react'
import { Card, Table, Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const NewsManage = () => {
  const [news, setNews] = useState([])

  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '分类', dataIndex: 'category', key: 'category' },
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
    <div className="admin-news-page">
      <Card
        title="新闻管理"
        extra={<Button type="primary">新增新闻</Button>}
      >
        <Table
          columns={columns}
          dataSource={news}
          rowKey="id"
          bordered
        />
      </Card>
    </div>
  )
}

export default NewsManage