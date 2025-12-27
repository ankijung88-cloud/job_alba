import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CompanyLanding from "./pages/CompanyLanding";
import CompanyDashboard from "./pages/company/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserLanding from "./pages/UserLanding";
import CategoryPage from "./pages/user/CategoryPage"; // ✅ 추가된 컴포넌트
import JobDetail from "./pages/user/JobDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공용 라우트 */}
        <Route path="/" element={<Login />} />

        {/* ✅ 카테고리 상세 페이지: 누구나 볼 수 있도록 공용 섹션에 추가 */}
        {/* /category/채용정보/스타트업 처럼 파라미터를 통해 동적으로 렌더링합니다. */}
        <Route path="/category/:menuName/:subName" element={<CategoryPage />} />

        {/* 기업 전용 */}
        <Route
          path="/CompanyLanding"
          element={
            <ProtectedRoute allowedRole="COMPANY">
              <CompanyLanding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/Dashboard"
          element={
            <ProtectedRoute allowedRole="COMPANY">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        {/* 개인 전용 */}
        <Route
          path="/UserLanding"
          element={
            <ProtectedRoute allowedRole="USER">
              <UserLanding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/Dashboard"
          element={
            <ProtectedRoute allowedRole="USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/job/:jobId" element={<JobDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
