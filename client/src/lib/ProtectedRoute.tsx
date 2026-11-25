import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { clearSession, hasValidSession } from './auth'

const ProtectedRoute = () => {
  const location = useLocation()

  if (!hasValidSession()) {
    clearSession()
    return <Navigate to="/user/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
