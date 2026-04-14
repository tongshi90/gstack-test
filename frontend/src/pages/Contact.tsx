import { Card, Descriptions } from 'antd'

const Contact = () => {
  return (
    <div className="contact-page">
      <Card title="联系我们">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="学校名称">XX中学</Descriptions.Item>
          <Descriptions.Item label="学校地址">XX省XX市XX区XX路XX号</Descriptions.Item>
          <Descriptions.Item label="邮政编码">XXXXXX</Descriptions.Item>
          <Descriptions.Item label="联系电话">010-12345678</Descriptions.Item>
          <Descriptions.Item label="招生办电话">010-87654321</Descriptions.Item>
          <Descriptions.Item label="电子邮箱">info@school.edu.cn</Descriptions.Item>
          <Descriptions.Item label="招生办邮箱">admissions@school.edu.cn</Descriptions.Item>
          <Descriptions.Item label="学校官网">www.school.edu.cn</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ width: '100%', height: 300, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            地图位置（待接入）
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Contact