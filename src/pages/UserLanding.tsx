import { useState, useRef, useEffect } from "react";
import Navigation from "./user/Navigation";
import HeroSection from "./user/HeroSection";
import JobCard from "./user/JobCard";
import CompanySearch from "./user/CompanySearch";
import type { JobData } from "./user/CompanySearch"; // Type-only import
import { FiTrendingUp, FiGift, FiMap, FiArrowRight, FiSearch, FiX } from "react-icons/fi";

export default function UserLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("전체");
  // 퀵 필터 버튼 목록 (UserLanding에 정의)
  const filterButtons = [
    { label: "전체", value: "전체" },
    { label: "💰 고수익", value: "고수익" },
    { label: "🏠 숙소제공", value: "숙소" },
    { label: "🛠 기술직", value: "기술" },
    { label: "⏰ 시간협의", value: "시간협의" },
  ];
  const [allJobs, setAllJobs] = useState<JobData[]>([]); // 전체 공고 리스트
  const [filteredRecommendedJobs, setFilteredRecommendedJobs] = useState<JobData[]>([]); // 필터링된 "추천" 공고

  const searchSectionRef = useRef<HTMLDivElement>(null);

  // 1. 초기 데이터 로드 (localStorage -> db_jobs)
  useEffect(() => {
    const jobsStr = localStorage.getItem("db_jobs");
    if (jobsStr) {
      try {
        const jobs: JobData[] = JSON.parse(jobsStr);
        // 최신순 정렬 (ID가 timestamp 기반이므로 역순 정렬하면 최신순)
        // 만약 postedAt이 있다면 그걸 기준해도 됨
        setAllJobs(jobs.reverse());
      } catch (e) {
        console.error("Failed to parse jobs", e);
      }
    }
  }, []);

  // 2. 검색어(searchQuery) 및 퀵필터(activeFilter) 변경 시 'Recommended for You' 섹션 필터링
  useEffect(() => {
    if (allJobs.length === 0) return;

    let results = allJobs;

    // 2-1. 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        (job.tags && job.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // 2-2. 퀵 필터 적용 (추가)
    if (activeFilter !== "전체") {
      results = results.filter(job =>
        (job.tags && job.tags.some(t => t.includes(activeFilter))) ||
        (job.title.includes(activeFilter)) ||
        (job.benefits && job.benefits.includes(activeFilter))
      );
    }

    setFilteredRecommendedJobs(results.slice(0, 8)); // 필터 적용 후 최대 8개 표시
  }, [searchQuery, activeFilter, allJobs]);


  const [showRisingModal, setShowRisingModal] = useState(false);
  const [risingJobs, setRisingJobs] = useState<JobData[]>([]);

  // 3. 급상승 공고 더미 데이터 초기화 (User Testing용)
  useEffect(() => {
    const statsStr = localStorage.getItem("db_job_applies");
    if (!statsStr && allJobs.length > 0) {
      const dummyStats: { [key: string]: number[] } = {};
      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;

      // 랜덤하게 지원 기록 생성
      allJobs.forEach(job => {
        if (Math.random() > 0.5) {
          const count = Math.floor(Math.random() * 20); // 0~20회
          const times = [];
          for (let i = 0; i < count; i++) {
            // 최근 7일 이내 랜덤 시간
            times.push(now - Math.floor(Math.random() * 7 * day));
          }
          dummyStats[job.id] = times;
        }
      });
      localStorage.setItem("db_job_applies", JSON.stringify(dummyStats));
    }
  }, [allJobs]);

  const handleRisingJobsClick = () => {
    const statsStr = localStorage.getItem("db_job_applies");
    const stats = statsStr ? JSON.parse(statsStr) : {};
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    // 각 공고별 최근 7일 지원 수 계산
    const jobScores = allJobs.map(job => {
      const timestamps: number[] = stats[job.id] || [];
      const recentCount = timestamps.filter(t => (now - t) <= sevenDays).length;
      return { ...job, recentCount };
    });

    // 지원 수 내림차순 정렬 후 상위 6개
    const top6 = jobScores
      .sort((a, b) => b.recentCount - a.recentCount)
      .slice(0, 6);

    setRisingJobs(top6);
    setShowRisingModal(true);
  };

  // handleSearchAction 제거됨 (HeroSection에 인라인으로 전달)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">구직자 전용 랜딩페이지</h1>
      <p className="text-gray-600">개인 회원만 접근 가능합니다.</p>

      <div className="w-screen min-h-screen bg-white flex flex-col overflow-x-hidden">
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
            {/* 2. Hero 섹션 */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchAction={(_val) => {
                // HeroSearch에서 엔터/버튼 누르면 스크롤 이동
                setTimeout(() => {
                  searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
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
                  onClick={item.title === "급상승 공고" ? handleRisingJobsClick : undefined}
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

            {/* 4. 최근 업데이트된 공고 (기존 CompanySearch) */}
            <div ref={searchSectionRef} className="scroll-mt-20">
              <CompanySearch
                jobs={allJobs} // ✅ 실제 공고 데이터 전달
              />
            </div>

            {/* 5. Recommended for You (필터 적용 영역) */}
            <section id="recommended-jobs">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 italic flex items-center gap-2">
                    Recommended for You
                    {searchQuery && (
                      <span className="text-base font-normal text-blue-600 not-italic bg-blue-50 px-3 py-1 rounded-full">
                        "{searchQuery}" 검색 결과
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-500 mt-1 text-sm">
                    {searchQuery
                      ? "입력하신 키워드와 관련된 공고를 찾아보았어요."
                      : "당신을 위한 맞춤 공고를 확인해보세요."}
                  </p>
                </div>

                {/* 필터 버튼들 (전체보기 대신 배치) */}
                <div className="flex flex-wrap gap-2">
                  {filterButtons.map((btn) => (
                    <button
                      key={btn.value}
                      onClick={() => setActiveFilter(btn.value)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${activeFilter === btn.value
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                        : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-500"
                        }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredRecommendedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredRecommendedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      pay={job.pay}
                    // id={job.id} // 필요시 JobCard에 id prop 추가하여 상세페이지 이동 연동
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl">
                      <FiSearch />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">검색 결과가 없어요</h3>
                  <p className="text-gray-500 text-sm">
                    다른 키워드로 검색하거나 필터를 변경해보세요.
                  </p>
                </div>
              )}
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

      </div>


      {/* 급상승 공고 모달 */}
      {
        showRisingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl">
              <button
                onClick={() => setShowRisingModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="text-2xl text-gray-500" />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  <FiTrendingUp className="text-red-500" />
                  급상승 공고 TOP 6
                </h2>
                <p className="text-gray-500 mt-2 font-medium">
                  최근 7일간 가장 많은 지원자가 몰린 인기 공고입니다. 🔥
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {risingJobs.map((job, idx) => (
                  <div key={job.id} className="relative">
                    {/* 순위 뱃지 */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-red-500 text-white rounded-xl shadow-lg flex items-center justify-center font-black text-xl z-10 border-2 border-white">
                      {idx + 1}
                    </div>
                    <JobCard
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      pay={job.pay}
                    />
                    <div className="mt-2 text-right">
                      <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                        {(job as any).recentCount}명 지원중!
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {risingJobs.length === 0 && (
                <div className="py-20 text-center text-gray-400">
                  <p>집계된 데이터가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )
      }
    </div >
  );
}
