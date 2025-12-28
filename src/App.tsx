import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CompanyLanding from "./pages/CompanyLanding";
import CompanyDashboard from "./pages/company/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserLanding from "./pages/UserLanding";
import CategoryPage from "./pages/user/CategoryPage"; // ✅ 추가된 컴포넌트
import JobDetail from "./pages/user/JobDetail";
import NewJobPostPage from "./pages/company/NewJobPostPage";
import C_CategoryPage from "./pages/company/C_CategoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공용 라우트 */}
        <Route path="/" element={<Login />} />
        {/* 2. 기업 담당자용 카테고리 페이지 (경로에 /company 추가) */}
        <Route
          path="/company/category/:menuName/:subName"
          element={<C_CategoryPage />}
        />
        {/* 1. 개인 구직자용 카테고리 페이지 */}
        {/* ✅ 카테고리 상세 페이지: 누구나 볼 수 있도록 공용 섹션에 추가 */}
        {/* /category/채용정보/스타트업 처럼 파라미터를 통해 동적으로 렌더링합니다. */}
        <Route path="/category/:menuName/:subName" element={<CategoryPage />} />
        <Route
          path="/Login"
          element={
            <ProtectedRoute allowedRole="USER">
              <Login />
            </ProtectedRoute>
          }
        />
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
        <Route path="/company/post" element={<NewJobPostPage />} />{" "}
        {/* 새 공고 등록 경로 */}
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
