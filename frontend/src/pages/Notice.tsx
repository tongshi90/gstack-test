import { Card, List, Typography } from 'antd'

const { Title, Paragraph } = Typography

const Notice = () => {
  const steps = [
    '登录学校官网，点击"在线报名"进入报名系统',
    '阅读报名须知，准备相关材料',
    '填写学生基本信息',
    '填写父母/监护人信息',
    '确认信息无误后提交',
    '保存报名号，等待学校通知'
  ]

  const materials = [
    '学生身份证原件及复印件',
    '户口本原件及复印件',
    '学生近期一寸免冠照片X张',
    '父母/监护人身份证复印件',
    '其他相关证明材料'
  ]

  return (
    <div className="notice-page">
      <Card title="报名须知">
        <Title level={3}>报名流程</Title>
        <List
          dataSource={steps}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<div className="step-number">{index + 1}</div>}
                description={item}
              />
            </List.Item>
          )}
          style={{ marginBottom: 32 }}
        />

        <Title level={3}>所需材料</Title>
        <List
          dataSource={materials}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta description={item} />
            </List.Item>
          )}
        />

        <Title level={3}>联系方式</Title>
        <Paragraph>
          如有疑问，请联系招生办公室：<br />
          电话：010-12345678<br />
          邮箱：admissions@school.edu.cn
        </Paragraph>
      </Card>
    </div>
  )
}

export default Notice