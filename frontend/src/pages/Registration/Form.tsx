import { useState, useEffect } from 'react'
import { Steps, Form, Input, DatePicker, Button, message, Radio } from 'antd'
import { useNavigate } from 'react-router-dom'
import { registrationService } from '@/services'
import type { StudentInfo, ParentsInfo } from '@/types'
import { validateIdCard, validatePhone } from '@/utils/validators'

const { Step } = Steps

const RegistrationForm = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [registrationNumber, setRegistrationNumber] = useState<string>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedNumber = localStorage.getItem('registrationDraftNumber')
    if (savedNumber) {
      setRegistrationNumber(savedNumber)
    }
  }, [])

  const steps = [
    { title: '学生基本信息', description: '填写学生的个人基本信息' },
    { title: '父母/监护人信息', description: '填写父母或监护人的信息' },
    { title: '确认提交', description: '确认填写的信息并提交' },
  ]

  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const result = await registrationService.saveDraft({
        registrationNumber,
        student: values.student,
        parents: values.parents
      })

      setRegistrationNumber(result.registrationNumber)
      localStorage.setItem('registrationDraftNumber', result.registrationNumber)
      message.success('草稿保存成功')
    } catch (error) {
      console.error('保存草稿失败:', error)
      message.error('保存草稿失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const result = await registrationService.submitRegistration({
        registrationNumber,
        student: values.student,
        parents: values.parents
      })

      localStorage.removeItem('registrationDraftNumber')
      navigate(`/registration/success?number=${result.registrationNumber}`)
    } catch (error: any) {
      console.error('提交报名失败:', error)
      if (error.response?.data?.detail) {
        message.error(error.response.data.detail)
      } else {
        message.error('提交失败，请检查填写的信息')
      }
    } finally {
      setLoading(false)
    }
  }

  const next = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['student'])
      } else if (currentStep === 1) {
        await form.validateFields(['parents'])
      }
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error('验证失败:', error)
    }
  }

  const prev = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className="registration-form-page">
      <div className="form-container">
        <h1>新生在线报名</h1>
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            student: { gender: 'male' as const },
          }}
        >
          {currentStep === 0 && (
            <div className="step-content">
              <h2>学生基本信息</h2>
              <Form.Item label="姓名" name={['student', 'name']} rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入学生姓名" maxLength={50} />
              </Form.Item>

              <Form.Item label="性别" name={['student', 'gender']} rules={[{ required: true, message: '请选择性别' }]}>
                <Radio.Group>
                  <Radio value="male">男</Radio>
                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="出生日期" name={['student', 'birthDate']} rules={[{ required: true, message: '请选择出生日期' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="请选择出生日期" />
              </Form.Item>

              <Form.Item label="身份证号" name={['student', 'idCard']} rules={[{ validator: (_, value) => Promise.resolve().then(() => {
                const error = validateIdCard(value)
                if (error) return Promise.reject(error)
                return Promise.resolve()
              }) }]}>
                <Input placeholder="请输入身份证号" maxLength={18} />
              </Form.Item>

              <Form.Item label="家庭住址" name={['student', 'address']} rules={[{ required: true, message: '请输入家庭住址' }]}>
                <Input.TextArea placeholder="请输入详细家庭住址" rows={3} maxLength={200} />
              </Form.Item>

              <Form.Item label="联系电话" name={['student', 'phone']} rules={[{ validator: (_, value) => Promise.resolve().then(() => {
                const error = validatePhone(value)
                if (error) return Promise.reject(error)
                return Promise.resolve()
              }) }]}>
                <Input placeholder="请输入联系电话" maxLength={11} />
              </Form.Item>
            </div>
          )}

          {currentStep === 1 && (
            <div className="step-content">
              <h2>父亲信息</h2>
              <Form.Item label="姓名" name={['parents', 'father', 'name']} rules={[{ required: true, message: '请输入父亲姓名' }]}>
                <Input placeholder="请输入父亲姓名" maxLength={50} />
              </Form.Item>

              <Form.Item label="联系电话" name={['parents', 'father', 'phone']} rules={[{ validator: (_, value) => Promise.resolve().then(() => {
                const error = validatePhone(value)
                if (error) return Promise.reject(error)
                return Promise.resolve()
              }) }]}>
                <Input placeholder="请输入联系电话" maxLength={11} />
              </Form.Item>

              <Form.Item label="工作单位" name={['parents', 'father', 'workUnit']}>
                <Input placeholder="请输入工作单位（选填）" maxLength={100} />
              </Form.Item>

              <h2>母亲信息</h2>
              <Form.Item label="姓名" name={['parents', 'mother', 'name']} rules={[{ required: true, message: '请输入母亲姓名' }]}>
                <Input placeholder="请输入母亲姓名" maxLength={50} />
              </Form.Item>

              <Form.Item label="联系电话" name={['parents', 'mother', 'phone']} rules={[{ validator: (_, value) => Promise.resolve().then(() => {
                const error = validatePhone(value)
                if (error) return Promise.reject(error)
                return Promise.resolve()
              }) }]}>
                <Input placeholder="请输入联系电话" maxLength={11} />
              </Form.Item>

              <Form.Item label="工作单位" name={['parents', 'mother', 'workUnit']}>
                <Input placeholder="请输入工作单位（选填）" maxLength={100} />
              </Form.Item>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content confirmation-step">
              <h2>确认信息</h2>
              <div className="info-summary">
                请确认填写的信息无误后提交
              </div>
            </div>
          )}
        </Form>

        <div className="form-actions">
          {currentStep > 0 && (
            <Button onClick={prev}>
              上一步
            </Button>
          )}

          {currentStep < steps.length - 1 && (
            <>
              <Button onClick={handleSaveDraft} loading={loading}>
                保存草稿
              </Button>
              <Button type="primary" onClick={next}>
                下一步
              </Button>
            </>
          )}

          {currentStep === steps.length - 1 && (
            <>
              <Button onClick={handleSaveDraft} loading={loading}>
                保存草稿
              </Button>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                提交报名
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegistrationForm