import Home from '@/page/Home'
import User from './page/user'
import { Routes, Route } from 'react-router-dom'
import Organization from './page/organization'
import CardPage from './page/cardPage'
import DepartmentPage from './page/departmentPage'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user" element={<User />} />
      <Route path="/organizations" element={<Organization />} />
      <Route path="/organizations/:organizationId" element={<CardPage />} />
      <Route path="/:organizationId" element={<DepartmentPage />} />


    </Routes>
  )
}

export default App