import { useState } from 'react'
import { Card, Table, Button, Space } from 'antd'
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'

const RegistrationsManage = () => {
  const [registrations, setRegistrations] = useState([])

  const columns = [
    { title: '报名号', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { title: '学生姓名', dataIndex: 'studentName', key: 'studentName' },
    { title: '性别', dataIndex: 'gender', key: 'gender' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '报名状态', dataIndex: 'status', key: 'status' },
    { title: '提交时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      )
    },
  ]

  return (
    <div className="admin-registrations-page">
      <Card title="报名管理">
        <Table
          columns={columns}
          dataSource={registrations}
          rowKey="id"
          bordered
        />
      </Card>
    </div>
  )
}

export default RegistrationsManage