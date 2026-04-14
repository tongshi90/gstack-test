export const validateIdCard = (value: string): string | undefined => {
  if (!value) return '请输入身份证号'
  if (value.length < 15 || value.length > 18) return '身份证号长度不正确'

  const reg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/
  if (!reg.test(value)) return '身份证号格式不正确'

  return undefined
}

export const validatePhone = (value: string): string | undefined => {
  if (!value) return '请输入手机号'
  if (value.length !== 11) return '手机号长度不正确'

  const reg = /^1[3-9]\d{9}$/
  if (!reg.test(value)) return '手机号格式不正确'

  return undefined
}