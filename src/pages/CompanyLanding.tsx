import { useRef, useState, useEffect } from "react";
import Navigation from "./company/CompanyNavigation";
import HeroSection from "./company/HeroSection";
import TalentSearch from "./company/TalentSearch";
import { FiX, FiFileText } from "react-icons/fi";

export default function CompanyLanding() {
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notices, setNotices] = useState<any[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  // Load Real Users & Notices
  useEffect(() => {
    // Users
    const usersStr = localStorage.getItem("db_users");
    if (usersStr) {
      try {
        const usersObj = JSON.parse(usersStr);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const usersList = Object.values(usersObj).filter((u: any) => u.id !== "admin" && u.role !== "ADMIN");
        setUsers(usersList);
      } catch (e) {
        console.error("Failed to load users", e);
      }
    }

    // Notices
    const noticesStr = localStorage.getItem("db_notices");
    if (noticesStr) {
      setNotices(JSON.parse(noticesStr).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, []);

  // 검색 버튼 클릭 시 실행될 함수
  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">기업 전용 랜딩페이지</h1>
      <p className="text-gray-600">기업 회원만 접근 가능합니다.</p>
      <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden">
        {/* 1. 최상단 광고 배너 (고정하고 싶다면 fixed 추가 가능) */}
        <div className="w-full h-[70px] bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
          <p className="text-base sm:text-lg font-semibold">
            🚀 지금 지원하면 최대 50만원 보너스 지급!
          </p>
        </div>

        {/* 2. 메인 컨테이너 */}
        <div className="max-w-7xl mx-auto w-full px-6 flex flex-col flex-1">
          <Navigation />

          <main className="flex-1 py-12">
            {/* HeroSection에 스크롤 함수를 전달하여 검색 버튼과 연결 + 검색어 전달 */}
            <HeroSection
              onSearchClick={scrollToSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            {/* 인재 검색 결과 페이지 (연결 지점): 실제 유저 데이터와 검색어 전달 */}
            <div ref={searchSectionRef} className="mt-20 border-t pt-10">
              <TalentSearch
                talents={users}
                searchQuery={searchQuery}
              />
            </div>

            {/* 공지사항 섹션 */}
            <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                <FiFileText className="text-purple-600" /> 공지사항
              </h2>

              <div className="overflow-hidden bg-white border border-gray-100 rounded-xl relative z-10">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500 w-20 text-center">No.</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">제목</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500 w-32 text-center">날짜</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {notices.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">
                          등록된 공지사항이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      notices.map((notice, index) => (
                        <tr
                          key={notice.id}
                          onClick={() => setSelectedNotice(notice)}
                          className="hover:bg-purple-50/50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 text-center text-gray-400 text-sm font-mono">
                            {notices.length - index}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {notice.title}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-500 text-sm">
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* 공지사항 모달 */}
              {selectedNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedNotice(null)}>
                  <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedNotice.title}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(selectedNotice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button onClick={() => setSelectedNotice(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <FiX className="text-xl text-gray-500" />
                      </button>
                    </div>
                    <div className="p-8 max-h-[60vh] overflow-y-auto leading-relaxed text-gray-700 whitespace-pre-wrap">
                      {selectedNotice.content}
                    </div>
                    <div className="px-8 py-5 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => setSelectedNotice(null)}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          <footer className="mt-20 border-t border-gray-200 py-10 text-center text-gray-400 text-sm">
            © 2025 JOB-ALBA. All rights reserved.
          </footer>
        </div>

      </div>
    </div>
  );
}
