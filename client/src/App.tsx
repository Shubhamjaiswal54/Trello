import Home from '@/page/Home'
import User from './page/user'
import { Routes, Route } from 'react-router-dom'
import Organization from './page/organization'
import CardPage from './page/cardPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user" element={<User />} />
      <Route path="/organizations" element={<Organization />} />
      <Route path="/organizations/:organizationId" element={<CardPage />} />


    </Routes>
  )
}

export default App