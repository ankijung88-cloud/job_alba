// Props 타입 정의
// import type { Dispatch, SetStateAction } from "react";
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  // FiSearch,
  FiBriefcase,
} from "react-icons/fi";

// UserLanding의 JobData와 호환되는 인터페이스 정의
export interface JobData {
  id: number | string;
  company: string;
  title: string;
  location: string;
  pay: string;
  tags?: string[];
  jobType?: string;
  category?: string;
  benefits?: string; // 줄바꿈 문자열로 저장됨
  deadline?: string;
}


interface CompanySearchProps {
  // keyword: string; // 검색어 필터링은 부모에서 처리하거나 필요시 부활
  jobs: JobData[]; // 부모로부터 전달받는 공고 리스트 (이미 정렬됨)
}

const CompanySearch = ({
  // keyword,
  jobs = [],
}: CompanySearchProps) => {

  // 퀵 필터 버튼 목록 제거 (UserLanding으로 이동)

  // 필터링 로직 제거 (부모에서 받은 jobs 그대로 표시)
  // 만약 검색어(keyword) 필터링이 여전히 필요하다면 남겨둘 수 있으나,
  // 요청사항은 "최근 업데이트된 공고"로서 순수하게 최신순 노출을 의도한 것으로 보임.
  // 다만 keyword는 HeroSearch 검색어인데, 여기서도 필터링을 유지할지는 선택.
  // "최근 업데이트된 공고"라는 명칭 변경에 따라 필터링 없이 최신순 노출이 더 적합해 보임.
  // -> filteredCompanies = jobs

  const handleApply = (jobId: string | number) => {
    // 1. 클릭 통계 저장 (급상승 공고용)
    const statsStr = localStorage.getItem("db_job_applies");
    const stats = statsStr ? JSON.parse(statsStr) : {};

    if (!stats[jobId]) {
      stats[jobId] = [];
    }
    stats[jobId].push(Date.now());

    // 최근 30일 데이터만 유지 (청소)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    stats[jobId] = stats[jobId].filter((ts: number) => ts > thirtyDaysAgo);

    localStorage.setItem("db_job_applies", JSON.stringify(stats));

    // 2. 지원 알림
    alert("지원이 완료되었습니다! (통계에 집계됨)");
  };

  return (
    <section className="w-full">
      {/* 헤더 영역 변경 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiBriefcase className="text-blue-600" />
            최근 업데이트된 공고
            <span className="text-blue-600 text-lg ml-1">
              {jobs.length}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            실시간으로 업데이트되는 최신 일자리에요.
          </p>
        </div>
        {/* 필터 버튼 영역 삭제됨 */}
      </div>

      {/* 결과 리스트 (그리드 레이아웃) */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.slice(0, 6).map((post) => ( // 최대 6개만 표시
            <div
              key={post.id}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full"
            >
              <div>
                {/* 상단 섹션: 기업명 & 급여 */}
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">
                        {post.category || "채용정보"}
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        {post.company}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors tracking-tight leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="flex items-center gap-1 text-red-500 font-black text-lg whitespace-nowrap">
                      <FiDollarSign className="text-sm" /> {post.pay.split(' ')[0]} {/* 간단히 표시 */}
                    </span>
                    <span className="text-[10px] text-gray-400 block">{post.pay.split(' ').slice(1).join('')}</span>
                  </div>
                </div>

                {/* 중간 섹션: 위치 & 시간 */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <FiMapPin className="text-gray-400" /> {post.location}
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <FiClock className="text-gray-400" /> {post.deadline || post.jobType}
                  </span>
                </div>
              </div>

              {/* 하단 섹션: 복지 태그 & 액션 */}
              <div className="flex justify-between items-center pt-5 border-t border-gray-50 mt-auto">
                <div className="flex gap-2 overflow-hidden">
                  {/* 태그가 있으면 태그 우선, 없으면 혜택(줄바꿈) 파싱 */}
                  {post.tags && post.tags.length > 0 ? (
                    post.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[11px] font-bold text-blue-500 whitespace-nowrap">
                        #{tag}
                      </span>
                    ))
                  ) : post.benefits ? (
                    post.benefits.split('\n').slice(0, 2).map((benefit, i) => (
                      <span key={i} className="text-[11px] font-bold text-blue-500 whitespace-nowrap">
                        #{benefit.replace(/^- /, '')}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-gray-400">상세 내용 확인</span>
                  )}
                </div>
                <button
                  onClick={() => handleApply(post.id)}
                  className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors whitespace-nowrap"
                >
                  지원하기
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 결과 없을 때 */
        <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
          <p className="text-gray-500">등록된 공고가 없습니다.</p>
        </div>
      )}
    </section>
  );
};
export default CompanySearch;
