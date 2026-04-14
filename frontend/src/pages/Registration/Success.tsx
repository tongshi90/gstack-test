import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, Result, Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

const RegistrationSuccess = () => {
  const [searchParams] = useSearchParams()
  const [registrationNumber, setRegistrationNumber] = useState('')

  useEffect(() => {
    const number = searchParams.get('number')
    if (number) {
      setRegistrationNumber(number)
    }
  }, [searchParams])

  return (
    <div className="registration-success-page">
      <Card>
        <Result
          status="success"
          title="报名成功！"
          subTitle={
            <div>
              <p>您的报名号是：<strong>{registrationNumber}</strong></p>
              <p>请妥善保存报名号，学校将根据报名号进行后续通知</p>
            </div>
          }
          extra={[
            <Button type="primary" key="home" href="#/" icon={<HomeOutlined />}>
              返回首页
            </Button>,
          ]}
        />
      </Card>
    </div>
  )
}

export default RegistrationSuccess