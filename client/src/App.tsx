import Home from '@/page/Home'
import User from './page/RegisterPage'
import { Routes, Route } from 'react-router-dom'
import Organization from './page/organization'
import MembersPage from './page/MembersPage'
import LoginPage from './page/loginPage'
import DepartmentPage from './page/departmentPage'
import BoardPage from './page/boardpage'
import CardsPage from './page/CardsPage'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user/login" element={<LoginPage />} />
      <Route path="/user/register" element={<User />} />

      <Route path="/organizations" element={<Organization />} />
      <Route path="/organizations/:organizationId" element={<MembersPage />} />

      <Route path="/:organizationId/departments" element={<DepartmentPage />} />
      <Route path="/:departmentId/board" element={<BoardPage />} />
      <Route path="/:boardId/cards" element={<CardsPage />} />
    </Routes>
  )
}

export default App