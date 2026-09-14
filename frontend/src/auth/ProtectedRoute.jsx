import { isAuthenticated, getCurrentUser } from "./authService";
import NotFound from "../pages/NotFound";

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <NotFound type="unauthorized" />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const user = getCurrentUser();
    if (!user || !allowedRoles.includes(user.role)) {
      return <NotFound type="unauthorized" />;
    }
  }

  return children;
}