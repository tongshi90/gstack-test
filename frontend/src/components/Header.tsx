import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { HomeOutlined, ReadOutlined, NotificationOutlined, FormOutlined, InfoCircleOutlined } from '@ant-design/icons'

const Header = () => {
  const location = useLocation()

  const menuItems: MenuProps['items'] = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
    { key: '/school-intro', icon: <InfoCircleOutlined />, label: <Link to="/school-intro">学校介绍</Link> },
    { key: '/news', icon: <ReadOutlined />, label: <Link to="/news">新闻中心</Link> },
    { key: '/announcements', icon: <NotificationOutlined />, label: <Link to="/announcements">通知公告</Link> },
    { key: '/registration', icon: <FormOutlined />, label: <Link to="/registration">在线报名</Link> },
  ]

  const getSelectedKey = () => {
    if (location.pathname.startsWith('/news')) return '/news'
    if (location.pathname.startsWith('/announcements')) return '/announcements'
    if (location.pathname.startsWith('/registration')) return '/registration'
    return location.pathname
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">XX中学</Link>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          className="header-menu"
        />
      </div>
    </header>
  )
}

export default Header