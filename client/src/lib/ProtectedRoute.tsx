import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // If there is no token, redirect them to the login page.
  // The 'replace' prop ensures they don't get stuck in a redirect loop 
  // if they click the back button in their browser.
  if (!token) {
    return <Navigate to="/user/login" replace />;
  }

  // If a token exists, render the requested page (the child routes)
  return <Outlet />;
};

export default ProtectedRoute;