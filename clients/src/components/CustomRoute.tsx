import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "../constants/type";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}

interface AuthUser {
  username: string;
  role: UserRole;
}

const getCurrentUser = (): AuthUser | null => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("jwtToken");
      return null;
    }

    const rawRole = decoded.roles?.[0] || "";

    const role = rawRole.startsWith("ROLE_")
      ? (rawRole.substring(5) as UserRole)
      : (rawRole as UserRole);

    return {
      username: decoded.sub,
      role,
    };
  } catch (err) {
    console.error("Invalid or malformed JWT token:", err);
    localStorage.removeItem("jwtToken");
    return null;
  }
};

interface CustomRouteProps {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

const CustomRoute = ({
  requiredRole,
  redirectTo = "/login",
}: CustomRouteProps = {}) => {
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
      return <Navigate to="/" replace />; // forbidden page
    }
  }

  return <Outlet />;
};

export default CustomRoute;
