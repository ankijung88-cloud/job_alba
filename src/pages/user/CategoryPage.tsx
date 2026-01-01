import { useParams, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import {
  FiArrowRight,
  FiFilter,
  FiCheckCircle,
  FiInfo,
  FiSearch,
} from "react-icons/fi"; // FiSearch 추가
import { useEffect, useState } from "react";
import { CATEGORY_DETAILS } from "../../constants/categoryData";
import { JOBS_BY_CATEGORY } from "../../constants/categoryJobs";
import type { Job } from "../../types/job"; // Shared type

const CategoryPage = () => {
  const { menuName, subName } = useParams<{
    menuName: string;
    subName: string;
  }>();
  const navigate = useNavigate();

  // URL 디코딩 처리
  const decodedMenu = decodeURIComponent(menuName || "");
  const decodedSub = decodeURIComponent(subName || "");

  // 1. 카테고리 정보 매핑 (없으면 동적 생성)
  let categoryInfo = CATEGORY_DETAILS[decodedSub];

  // 외국인 채용 카테고리에 대한 동적 정보 생성
  if (!categoryInfo && decodedMenu === "외국인채용") {
    categoryInfo = {
      description: `${decodedSub} 비자 소지자를 위한 전문 채용 공고를 모았습니다.`,
      tags: ["#외국인채용", `#${decodedSub}`, "#비자가능"],
      themeColor: "red",
    };
  }

  // 기본값 (여전히 없으면)
  if (!categoryInfo) {
    categoryInfo = {
      description: "시스템이 실시간으로 분석한 가장 평점이 높고 안전한 공고들을 보여드립니다.",
      tags: ["#신규공고", "#실시간", "#인기"],
      themeColor: "blue",
    };
  }

  // 2. ✅ 해당 카테고리의 실제 공고 리스트 가져오기 (Static + LocalStorage)
  const [jobList, setJobList] = useState<Job[]>([]);

  useEffect(() => {
    // 1. Static Data
    const staticJobs = (JOBS_BY_CATEGORY[decodedSub] || []) as unknown as Job[];

    // 2. Dynamic Data from LocalStorage
    const storedJobsStr = localStorage.getItem("db_jobs");
    const storedJobs: Job[] = storedJobsStr ? JSON.parse(storedJobsStr) : [];

    // 3. Filter Dynamic Jobs by Category
    let filteredDynamicJobs: Job[] = [];

    if (decodedMenu === "외국인채용") {
      // 외국인 채용은 'category' 필드 매칭이 아니라 태그나 제목에서 비자 코드(예: E-9)를 찾음
      filteredDynamicJobs = storedJobs.filter(job =>
        (job.tags && job.tags.some(tag => tag.includes(decodedSub))) ||
        (job.title.includes(decodedSub)) ||
        (job.benefits && job.benefits.includes(decodedSub)) ||
        (job.description && job.description.includes(decodedSub))
      );
    } else {
      // 일반 카테고리는 category 필드 일치 여부 확인
      filteredDynamicJobs = storedJobs.filter(job => job.category === decodedSub);
    }

    // 4. Merge
    setJobList([...filteredDynamicJobs, ...staticJobs]);

    window.scrollTo(0, 0);
  }, [menuName, subName, decodedSub]);

  if (!menuName || !subName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiInfo size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">잘못된 접근입니다.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* (선택 사항) 페이지 상단 텍스트가 필요 없다면 삭제하셔도 됩니다. */}
      <h1 className="text-4xl font-bold mb-4">구직 서비스 관리</h1>
      <p className="text-gray-600 mb-6">해당 카테고리의 데이터를 관리합니다.</p>

      {/* 2. 실제 웹사이트 프레임: w-screen을 통해 가로 배경을 꽉 채우되 내부를 다시 중앙 정렬합니다. */}
      <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden flex flex-col items-center">
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />

          <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow">
            {/* 브레드크럼 */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 bg-white w-fit px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <span
                className="cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => navigate("/UserLanding")}
              >
                홈
              </span>
              <span className="text-gray-300 font-thin">/</span>
              <span className="text-gray-500">{decodedMenu}</span>
              <span className="text-gray-300 font-thin">/</span>
              <span className="text-blue-600 font-bold">{decodedSub}</span>
            </nav>

            {/* 상단 헤더 섹션 */}
            <div className="relative overflow-hidden bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm mb-12">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`px-3 py-1 bg-${categoryInfo.themeColor}-600 text-white text-xs font-black rounded-full uppercase tracking-tighter`}
                    >
                      Verified Category
                    </span>
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                    {decodedSub}
                    <span
                      className={`block text-${categoryInfo.themeColor}-600 text-2xl mt-1 font-bold`}
                    >
                      맞춤 채용 정보를 확인하세요
                    </span>
                  </h1>
                  <p className="text-gray-500 mt-4 leading-relaxed">
                    {categoryInfo.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {categoryInfo.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button className={`flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-${categoryInfo.themeColor}-600 transition-all hover:-translate-y-1 active:scale-95`}>
                  <FiFilter /> 상세 조건 설정
                </button>
              </div>
              <div
                className={`absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-${categoryInfo.themeColor}-50 rounded-full blur-3xl opacity-50`}
              ></div>
            </div>

            {/* ✅ 공고 리스트 영역 (조건부 렌더링) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobList.length > 0 ? (
                jobList.map((job) => (
                  <div
                    key={job.id}
                    className="group bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-300 relative"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <FiCheckCircle
                          className="text-gray-300 group-hover:text-blue-500"
                          size={24}
                        />
                      </div>
                      {job.isUrgent && (
                        <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-black rounded-lg">
                          급구
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-6">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium">
                        {job.company}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[12px] font-bold px-3 py-1 bg-blue-50 text-blue-500 rounded-full italic"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Estimated Pay
                        </span>
                        <span className="text-lg font-black text-gray-900">
                          {job.pay}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/job/${job.id}`)}
                        className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all"
                      >
                        상세보기
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                /* ✅ 데이터가 없을 때 보여줄 화면 */
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <FiSearch size={48} className="text-gray-200 mb-4" />
                  <h3 className="text-lg font-bold text-gray-400">
                    등록된 공고가 없습니다.
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    다른 카테고리를 확인해보시겠어요?
                  </p>
                </div>
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
