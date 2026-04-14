import { createBrowserRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import SchoolIntro from '@/pages/SchoolIntro'
import NewsList from '@/pages/News/List'
import NewsDetail from '@/pages/News/Detail'
import AnnouncementsList from '@/pages/Announcements/List'
import AnnouncementsDetail from '@/pages/Announcements/Detail'
import RegistrationForm from '@/pages/Registration/Form'
import RegistrationSuccess from '@/pages/Registration/Success'
import Notice from '@/pages/Notice'
import Contact from '@/pages/Contact'
import AdminLayout from '@/pages/Admin/Layout'
import NewsManage from '@/pages/Admin/News'
import AnnouncementsManage from '@/pages/Admin/Announcements'
import RegistrationsManage from '@/pages/Admin/Registrations'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/school-intro',
    element: <SchoolIntro />,
  },
  {
    path: '/news',
    element: <NewsList />,
  },
  {
    path: '/news/:id',
    element: <NewsDetail />,
  },
  {
    path: '/announcements',
    element: <AnnouncementsList />,
  },
  {
    path: '/announcements/:id',
    element: <AnnouncementsDetail />,
  },
  {
    path: '/registration',
    element: <RegistrationForm />,
  },
  {
    path: '/registration/success',
    element: <RegistrationSuccess />,
  },
  {
    path: '/notice',
    element: <Notice />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'news',
        element: <NewsManage />,
      },
      {
        path: 'announcements',
        element: <AnnouncementsManage />,
      },
      {
        path: 'registrations',
        element: <RegistrationsManage />,
      },
    ],
  },
])

export default router