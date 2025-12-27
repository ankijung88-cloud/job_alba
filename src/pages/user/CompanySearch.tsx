import type { Dispatch, SetStateAction } from "react";
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiSearch,
  FiBriefcase,
} from "react-icons/fi";

// Props 타입 정의
interface CompanySearchProps {
  externalFilter: string;
  setExternalFilter: Dispatch<SetStateAction<string>>;
  keyword: string;
}

const CompanySearch = ({
  externalFilter,
  setExternalFilter,
  keyword,
}: CompanySearchProps) => {
  // 실제 서비스에서는 API로 불러올 더미 데이터
  const companyPostings = [
    {
      id: 1,
      companyName: "(주)글로벌푸드",
      title: "프랜차이즈 주방 정규직 모집",
      pay: "월 380만",
      location: "서울 강남구",
      benefits: ["1인 1실 숙소", "중석식 제공"],
      tags: ["#숙소제공", "#고수익"],
      workTime: "09:00 - 18:00",
      category: "외식/주방",
    },
    {
      id: 2,
      companyName: "대건건설",
      title: "현장 안전 관리 요원 (경력무관)",
      pay: "일급 16만",
      location: "경기 평택시",
      benefits: ["현장 숙소", "통근버스"],
      tags: ["#숙소제공", "#고수익", "#기술직"],
      workTime: "08:00 - 17:00",
      category: "건설/현장",
    },
    {
      id: 3,
      companyName: "카페 루미에르",
      title: "바리스타 및 매장관리 채용",
      pay: "월 270만",
      location: "서울 마포구",
      benefits: ["4대보험", "유연근무"],
      tags: ["#시간협의"],
      workTime: "스케줄 협의",
      category: "서비스/카페",
    },
    {
      id: 4,
      companyName: "로지스틱스 킹",
      title: "야간 물류 상하차 전담팀",
      pay: "일급 13만",
      location: "인천 서구",
      benefits: ["당일지급", "야간수당"],
      tags: ["#고수익", "#단기"],
      workTime: "20:00 - 05:00",
      category: "물류/배송",
    },
  ];

  // 퀵 필터 버튼 목록
  const filterButtons = [
    { label: "전체", value: "전체" },
    { label: "💰 고수익", value: "#고수익" },
    { label: "🏠 숙소제공", value: "#숙소제공" },
    { label: "🛠 기술직", value: "#기술직" },
    { label: "⏰ 시간협의", value: "#시간협의" },
  ];

  // 필터링 로직 (태그 + 검색어 중복 적용)
  const filteredCompanies = companyPostings.filter((post) => {
    const matchesFilter =
      externalFilter === "전체" || post.tags.includes(externalFilter);
    const matchesKeyword =
      post.title.includes(keyword) ||
      post.companyName.includes(keyword) ||
      post.location.includes(keyword) ||
      post.category.includes(keyword);
    return matchesFilter && matchesKeyword;
  });

  return (
    <section className="w-full">
      {/* 필터 헤더 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiBriefcase className="text-blue-600" />
            맞춤 채용 공고
            <span className="text-blue-600 text-lg ml-1">
              {filteredCompanies.length}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            실시간으로 업데이트되는 최신 일자리에요.
          </p>
        </div>

        {/* 칩 스타일 필터 버튼 */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setExternalFilter(btn.value)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                externalFilter === btn.value
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-500"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 리스트 (그리드 레이아웃) */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCompanies.map((post) => (
            <div
              key={post.id}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
            >
              {/* 상단 섹션: 기업명 & 급여 */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-xs font-semibold text-blue-600">
                      {post.companyName}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">
                    {post.title}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="flex items-center gap-1 text-red-500 font-black text-lg">
                    <FiDollarSign className="text-sm" /> {post.pay}
                  </span>
                </div>
              </div>

              {/* 중간 섹션: 위치 & 시간 */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                  <FiMapPin className="text-gray-400" /> {post.location}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                  <FiClock className="text-gray-400" /> {post.workTime}
                </span>
              </div>

              {/* 하단 섹션: 복지 태그 & 액션 */}
              <div className="flex justify-between items-center pt-5 border-t border-gray-50">
                <div className="flex gap-2">
                  {post.benefits.slice(0, 2).map((benefit, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-bold text-blue-500"
                    >
                      #{benefit}
                    </span>
                  ))}
                </div>
                <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors">
                  지원하기
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 검색 결과 없을 때 */
        <div className="py-32 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
            <FiSearch size={30} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            검색 결과가 없어요
          </h3>
          <p className="text-gray-500 mt-2">
            다른 검색어나 필터를 사용해 보세요.
          </p>
          <button
            onClick={() => {
              setExternalFilter("전체");
            }}
            className="mt-6 text-blue-600 font-bold underline"
          >
            필터 초기화하기
          </button>
        </div>
      )}
    </section>
  );
};

export default CompanySearch;
