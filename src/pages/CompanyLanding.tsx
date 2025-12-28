import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./company/CompanyNavigation";
import HeroSection from "./company/HeroSection";
import JobCard from "./company/JobCard";
import TalentSearch from "./company/TalentSearch";
import { FiArrowRight } from "react-icons/fi";

export default function CompanyLanding() {
  const navigate = useNavigate();
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // 검색 버튼 클릭 시 실행될 함수
  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const dummyJobs = [
    {
      id: 1,
      company: "(주)테크컴퍼니",
      title: "프론트엔드 개발자 긴급 채용",
      location: "서울 강남구",
      pay: "연봉 4,500+",
    },
    {
      id: 2,
      company: "카페그라운드",
      title: "주말 오전 파트타임 구인",
      location: "경기 수원시",
      pay: "시급 10,000원",
    },
    {
      id: 3,
      company: "디자인스튜디오",
      title: "웹 퍼블리셔 계약직 모집",
      location: "서울 마포구",
      pay: "월 300+",
    },
    {
      id: 4,
      company: "물류센터",
      title: "단기 물류 보조 알바생",
      location: "인천 서구",
      pay: "일급 12만원",
    },
  ];

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
            {/* HeroSection에 스크롤 함수를 전달하여 검색 버튼과 연결 */}
            <HeroSection onSearchClick={scrollToSearch} />
            {/* 인재 검색 결과 페이지 (연결 지점) */}
            <div ref={searchSectionRef} className="mt-20 border-t pt-10">
              <TalentSearch />
            </div>

            <div className="flex justify-between items-end mb-8 mt-12">
              <h2 className="text-2xl font-bold text-gray-800">추천 공고</h2>
              <span className="text-blue-600 cursor-pointer font-medium hover:underline">
                전체보기 &gt;
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dummyJobs.map((job) => (
                <JobCard key={`${job.id}-${job.title}`} {...job} />
              ))}
            </div>
          </main>

          <footer className="mt-20 border-t border-gray-200 py-10 text-center text-gray-400 text-sm">
            © 2025 JOB-ALBA. All rights reserved.
          </footer>
        </div>
        <button
          onClick={() => navigate("/Login")}
          className="fixed bottom-24 right-8 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
        >
          <span className="text-[10px] font-bold mb-1">LOGIN</span>
          <FiArrowRight className="rotate-180 text-xl group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* 플로팅 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
        >
          <span className="text-[10px] font-bold mb-1">이전</span>
          <FiArrowRight className="rotate-180 text-xl group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
