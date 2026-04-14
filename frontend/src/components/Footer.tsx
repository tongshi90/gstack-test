import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>关于我们</h3>
          <a><Link to="/school-intro">学校介绍</Link></a>
          <a><Link to="/notice">报名须知</Link></a>
        </div>
        <div className="footer-section">
          <h3>联系方式</h3>
          <p>地址：XX省XX市XX区XX路XX号</p>
          <p>电话：010-12345678</p>
          <p>邮箱：info@school.edu.cn</p>
        </div>
        <div className="footer-section">
          <h3>快速链接</h3>
          <a><Link to="/news">新闻中心</Link></a>
          <a><Link to="/announcements">通知公告</Link></a>
          <a><Link to="/registration">在线报名</Link></a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 XX中学 版权所有</p>
      </div>
    </footer>
  )
}

export default Footer