import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/lib/ProtectedRoute'
import AppShell from '@/components/AppShell'
import NotFound from '@/components/ui/NotFound'

const Home = lazy(() => import('@/page/Home'))
const LoginPage = lazy(() => import('@/page/LoginPage'))
const RegisterPage = lazy(() => import('@/page/RegisterPage'))
const OrganizationsPage = lazy(() => import('@/page/OrganizationsPage'))
const MembersPage = lazy(() => import('@/page/MembersPage'))
const DepartmentsPage = lazy(() => import('@/page/DepartmentsPage'))
const BoardsPage = lazy(() => import('@/page/BoardsPage'))
const CardsPage = lazy(() => import('@/page/CardsPage'))

const App = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/user/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/organizations/:organizationId" element={<DepartmentsPage />} />
            <Route path="/organizations/:organizationId/members" element={<MembersPage />} />
            <Route path="/departments/:departmentId" element={<BoardsPage />} />
            <Route path="/boards/:boardId" element={<CardsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
