import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/**
 * 主应用组件
 * 包含全局布局：头部、主内容区、底部
 */
function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App