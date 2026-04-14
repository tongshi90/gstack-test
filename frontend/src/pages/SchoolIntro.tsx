import { Card, Row, Col } from 'antd'

const SchoolIntro = () => {
  return (
    <div className="school-intro-page">
      <Card title="学校简介">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="intro-text">
              <h3>学校概况</h3>
              <p>
                XX中学创建于XXXX年，是一所具有悠久历史和优良传统的现代化中学。
                学校占地面积XX平方米，现有教学班XX个，在校学生XX人，教职工XX人。
              </p>
              <p>
                学校秉承"XXXX"的办学理念，致力于培养德智体美劳全面发展的新时代人才。
              </p>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="campus-images">
              <h3>校园风光</h3>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <div className="image-placeholder">教学楼</div>
                </Col>
                <Col span={12}>
                  <div className="image-placeholder">操场</div>
                </Col>
                <Col span={12}>
                  <div className="image-placeholder">图书馆</div>
                </Col>
                <Col span={12}>
                  <div className="image-placeholder">体育馆</div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="师资力量" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <p>
              学校拥有一支高素质的教师队伍，其中特级教师XX人，高级教师XX人，一级教师XX人。
              教师学历达标率100%，硕士研究生及以上学历教师占比XX%。
            </p>
            <p>
              学校注重教师专业发展，定期组织教研活动和培训，不断提高教师教育教学水平。
            </p>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default SchoolIntro