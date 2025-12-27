import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./user/Navigation";
import HeroSection from "./user/HeroSection";
import JobCard from "./user/JobCard";
import CompanySearch from "./user/CompanySearch";
import { FiTrendingUp, FiGift, FiMap, FiArrowRight } from "react-icons/fi";

export default function UserLanding() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("전체");
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const handleSearchAction = (filterValue: string) => {
    setActiveFilter(filterValue);
    setTimeout(() => {
      searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
      <h1 className="text-4xl font-bold mb-4">구직자 전용 랜딩페이지</h1>
      <p className="text-gray-600">개인 회원만 접근 가능합니다.</p>

      <div className="w-screen h-screen bg-white flex flex-col overflow-x-hidden">
        {/* 1. 상단 프로모션 배너 */}
        <div className="w-full h-[70px] bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 z-50 shadow-sm">
          <p className="text-sm sm:text-base font-medium">
            🎉 지금 가입하고 첫 지원하면{" "}
            <span className="underline decoration-2 font-bold">
              취업 축하금 50만원
            </span>
            을 드립니다!
          </p>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex flex-col">
          <Navigation />

          <main className="py-10 space-y-24">
            {/* 2. Hero 섹션 (Props 전달) */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchAction={handleSearchAction}
            />

            {/* 3. 퀵 메뉴 */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "급상승 공고",
                  desc: "지금 핫한 일자리",
                  icon: <FiTrendingUp />,
                  color: "text-red-500 bg-red-50",
                },
                {
                  title: "복지 좋은 곳",
                  desc: "숙소/식사 제공",
                  icon: <FiGift />,
                  color: "text-blue-500 bg-blue-50",
                },
                {
                  title: "지도 탐색",
                  desc: "내 주변 일자리 찾기",
                  icon: <FiMap />,
                  color: "text-green-500 bg-green-50",
                },
                {
                  title: "맞춤 제안",
                  desc: "내 이력서 기반",
                  icon: <FiArrowRight />,
                  color: "text-purple-500 bg-purple-50",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-gray-100 rounded-2xl hover:shadow-lg transition-all cursor-pointer group bg-white"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </section>

            {/* 4. 검색 결과 영역 */}
            <div ref={searchSectionRef} className="scroll-mt-20">
              <CompanySearch
                externalFilter={activeFilter}
                setExternalFilter={setActiveFilter}
                keyword={searchQuery}
              />
            </div>

            {/* 5. 추천 공고 */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 italic">
                    Recommended for You
                  </h2>
                  <p className="text-gray-500 mt-1 text-sm">
                    최근 본 공고와 비슷한 일자리에요.
                  </p>
                </div>
                <button className="text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  전체보기 <FiArrowRight />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dummyJobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            </section>
          </main>

          <footer className="mt-32 border-t border-gray-100 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
              <div className="text-xl font-black text-blue-600 italic underline decoration-blue-200 decoration-4 tracking-tighter">
                JOB-ALBA
              </div>
              <div className="flex gap-8 text-sm text-gray-400">
                <span className="hover:text-gray-600 cursor-pointer">
                  이용약관
                </span>
                <span className="hover:text-gray-600 cursor-pointer font-bold text-gray-600">
                  개인정보처리방침
                </span>
                <span className="hover:text-gray-600 cursor-pointer">
                  고객센터
                </span>
              </div>
              <p className="text-xs text-gray-300">
                © 2025 JOB-ALBA Corp. All rights reserved.
              </p>
            </div>
          </footer>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
        >
          <FiArrowRight className="rotate-180 text-xl group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
