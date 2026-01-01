import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "./CompanyNavigation";
import { FiPlus, FiBriefcase, FiXCircle, FiEdit2, FiTrash2, FiRefreshCw, FiMoreHorizontal } from "react-icons/fi";
import type { Job } from "../../types/job";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "CLOSED">("ACTIVE");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null); // 현재 열린 메뉴 ID

  // 데이터 로드
  useEffect(() => {
    const loadJobs = () => {
      const storedJobsStr = localStorage.getItem("db_jobs");
      if (storedJobsStr) {
        setJobs(JSON.parse(storedJobsStr));
      }
      setLoading(false);
    };

    loadJobs();

    window.addEventListener('storage', loadJobs);
    return () => window.removeEventListener('storage', loadJobs);
  }, []);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.action-menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // 상태별 필터링
  const getFilteredJobs = (status: "active" | "closed") => {
    return jobs.filter(job => {
      const jobStatus = job.status || (new Date(job.deadline) < new Date() ? 'closed' : 'active');
      return jobStatus === status;
    });
  };

  const activeJobs = getFilteredJobs("active");
  const closedJobs = getFilteredJobs("closed");

  // 핸들러
  const handleCloseJob = (id: string | number) => {
    if (!window.confirm("정말로 이 공고를 마감하시겠습니까?")) return;
    const updatedJobs = jobs.map(job =>
      String(job.id) === String(id) ? { ...job, status: 'closed' as const } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem("db_jobs", JSON.stringify(updatedJobs));
    setOpenMenuId(null);
  };

  const handleRelistJob = (id: string | number) => {
    if (!window.confirm("이 공고를 다시 진행중으로 변경하시겠습니까?")) return;
    const updatedJobs = jobs.map(job =>
      String(job.id) === String(id) ? { ...job, status: 'active' as const } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem("db_jobs", JSON.stringify(updatedJobs));
    setOpenMenuId(null);
  };

  const handleDeleteJob = (id: string | number) => {
    if (!window.confirm("정말로 이 공고를 삭제하시겠습니까?")) return;
    const updatedJobs = jobs.filter(job => String(job.id) !== String(id));
    setJobs(updatedJobs);
    localStorage.setItem("db_jobs", JSON.stringify(updatedJobs));
    setOpenMenuId(null);
  };

  const toggleMenu = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">채용 공고 관리</h1>
            <p className="text-gray-500">등록한 공고 현황을 한눈에 확인하고 관리하세요.</p>
          </div>
          <Link
            to="/company/post"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FiPlus className="text-xl" /> 새 공고 등록
          </Link>
        </div>

        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("ACTIVE")}
            className={`pb-4 px-6 text-lg font-bold transition-all border-b-2 ${activeTab === "ACTIVE"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            진행중인 공고 <span className="ml-2 py-0.5 px-2 bg-gray-100 rounded-full text-sm text-gray-600">{activeJobs.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("CLOSED")}
            className={`pb-4 px-6 text-lg font-bold transition-all border-b-2 ${activeTab === "CLOSED"
              ? "border-gray-800 text-gray-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            마감된 공고 <span className="ml-2 py-0.5 px-2 bg-gray-100 rounded-full text-sm text-gray-600">{closedJobs.length}</span>
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-gray-500">데이터를 불러오는 중...</div>
          ) : (activeTab === "ACTIVE" ? activeJobs : closedJobs).length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-gray-300 text-6xl mb-4 text-center mx-auto w-fit"><FiBriefcase /></div>
              <p className="text-xl font-bold text-gray-900 mb-2">
                {activeTab === "ACTIVE" ? "진행중인 공고가 없습니다." : "마감된 공고가 없습니다."}
              </p>
            </div>
          ) : (
            (activeTab === "ACTIVE" ? activeJobs : closedJobs).map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-6 relative">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg truncate">
                      {job.category}
                    </span>
                    <span className="text-gray-400 text-xs">
                      등록일: {job.postedAt}
                    </span>
                    {job.deadline === "상시채용" ? (
                      <span className="text-green-600 text-xs font-bold border border-green-200 px-2 py-0.5 rounded">상시</span>
                    ) : (
                      <span className="text-red-500 text-xs font-bold">D-{
                        Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      }</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600" onClick={() => navigate(`/job/${job.id}`)}>
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">📍 {job.location}</span>
                    <span className="flex items-center gap-1">💰 {job.pay}</span>
                  </div>
                </div>

                {/* 점 메뉴 (Action Menu) */}
                <div className="action-menu-container relative">
                  <button
                    onClick={(e) => toggleMenu(job.id, e)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <FiMoreHorizontal className="text-xl" />
                  </button>

                  {openMenuId === job.id && (
                    <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden animate-fade-in-down">
                      {activeTab === "ACTIVE" ? (
                        <>
                          <button
                            onClick={() => navigate(`/company/edit/${job.id}`)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium text-sm flex items-center gap-2"
                          >
                            <FiEdit2 /> 수정하기
                          </button>
                          <button
                            onClick={() => handleCloseJob(job.id)}
                            className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-medium text-sm flex items-center gap-2"
                          >
                            <FiXCircle /> 마감처리
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRelistJob(job.id)}
                            className="w-full text-left px-4 py-3 hover:bg-green-50 text-green-600 font-medium text-sm flex items-center gap-2"
                          >
                            <FiRefreshCw /> 재등록
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-500 font-medium text-sm flex items-center gap-2"
                          >
                            <FiTrash2 /> 삭제하기
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
