import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h2>后台管理</h2>
        <nav>
          <a href="#/admin/news">新闻管理</a>
          <a href="#/admin/announcements">公告管理</a>
          <a href="#/admin/registrations">报名管理</a>
        </nav>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout