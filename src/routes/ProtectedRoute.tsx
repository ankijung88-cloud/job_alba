import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRole: "USER" | "COMPANY";
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRole,
  children,
}: ProtectedRouteProps) {
  const role = localStorage.getItem("role") as "USER" | "COMPANY" | null;

  // 로그인 안 됨
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // 권한 불일치
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
