import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '../constants/type';

const getCurrentUser = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;

  return { role: 'Admin' as UserRole };
};

interface ProtectedRouteProps {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}


const ProtectedRoute = ({ requiredRole, redirectTo = '/login' }: ProtectedRouteProps = {}) => {
  const user = getCurrentUser();

  // Not logged in → redirect
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Role check
  if (requiredRole) {
    const userRole = user.role;

    const hasRole = Array.isArray(requiredRole)
      ? requiredRole.includes(userRole)
      : userRole === requiredRole;

    if (!hasRole) {
      return <Navigate to="/" replace />; // or to forbidden page
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;