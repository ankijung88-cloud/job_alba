import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompanyLanding from "./pages/CompanyLanding";
import CompanyDashboard from "./pages/company/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserLanding from "./pages/UserLanding";
import CategoryPage from "./pages/user/CategoryPage";
import JobDetail from "./pages/user/JobDetail";
import NewJobPostPage from "./pages/company/NewJobPostPage";
import C_CategoryPage from "./pages/company/C_CategoryPage";
import UserProfileEdit from "./pages/user/UserProfileEdit";
import CompanyProfileEdit from "./pages/company/CompanyProfileEdit";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfileEdit from "./pages/admin/AdminProfileEdit";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminNoticeManage from "./pages/admin/AdminNoticeManage";
import MainLayout from "./layouts/MainLayout";
import ForeignSupportBoard from "./pages/company/ForeignSupportBoard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* 공용 라우트 */}
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user/profile" element={<UserProfileEdit />} />

          <Route
            path="/company/edit"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <CompanyProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notices"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminNoticeManage />
              </ProtectedRoute>
            }
          />


          {/* 2. 기업 담당자용 카테고리 페이지 (경로에 /company 추가) */}
          <Route
            path="/company/category/:menuName/:subName"
            element={<C_CategoryPage />}
          />
          <Route
            path="/company/foreign/:id"
            element={<ForeignSupportBoard />}
          />
          {/* 1. 개인 구직자용 카테고리 페이지 */}
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
          <Route path="/company/edit/:jobId" element={<NewJobPostPage />} />{" "}
          {/* 새 공고 등록 및 수정 경로 */}
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
