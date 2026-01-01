import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRole: "USER" | "COMPANY" | "ADMIN";
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRole,
  children,
}: ProtectedRouteProps) {
  const role = localStorage.getItem("role") as "USER" | "COMPANY" | "ADMIN" | null;

  // 로그인 안 됨
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // 권한 불일치 (관리자는 프리패스)
  if (role !== "ADMIN" && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
