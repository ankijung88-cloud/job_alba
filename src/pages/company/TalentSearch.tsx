import { useState } from "react";
import { FiUser, FiClock, FiCheckCircle, FiAward } from "react-icons/fi";

// 인재 데이터 타입 정의
interface Talent {
  id: number;
  name: string;
  role: string;
  experience: string;
  tags: string[];
  location: string;
  visa?: string;
}

export default function TalentSearch() {
  // 1. 상태 관리: 현재 선택된 필터 (기본값: 전체)
  const [selectedFilter, setSelectedFilter] = useState("전체");

  // 2. 더미 데이터 (기업용 인재 리스트)
  const dummyTalents: Talent[] = [
    {
      id: 1,
      name: "김철수",
      role: "카페 매니저",
      experience: "3년",
      tags: ["#즉시출근", "#경력보유"],
      location: "서울 강남구",
    },
    {
      id: 2,
      name: "이영희",
      role: "조리사",
      experience: "5년",
      tags: ["#6개월이상", "#경력보유"],
      location: "경기 수원시",
    },
    {
      id: 3,
      name: "박지민",
      role: "홀서빙",
      experience: "신입",
      tags: ["#즉시출근", "#비자확인완료"],
      location: "인천 부평구",
      visa: "F-4",
    },
    {
      id: 4,
      name: "정민호",
      role: "물류 관리",
      experience: "1년",
      tags: ["#6개월이상"],
      location: "서울 송파구",
    },
    {
      id: 5,
      name: "첸 웨이",
      role: "주방 보조",
      experience: "2년",
      tags: ["#비자확인완료", "#즉시출근"],
      location: "서울 마포구",
      visa: "E-9",
    },
  ];

  // 3. 필터링 로직
  const filteredTalents =
    selectedFilter === "전체"
      ? dummyTalents
      : dummyTalents.filter((talent) => talent.tags.includes(selectedFilter));

  const filterButtons = [
    "전체",
    "#즉시출근",
    "#경력보유",
    "#6개월이상",
    "#비자확인완료",
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 min-h-screen">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          비즈니스 맞춤 인재 검색
        </h2>
        <p className="text-gray-600">
          조건에 맞는 최적의 근로자를 빠르게 찾아보세요.
        </p>
      </div>

      {/* 퀵 필터 버튼 영역 */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {filterButtons.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-6 py-2 rounded-full font-medium transition-all shadow-sm ${
              selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:border-blue-400 border border-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 인재 검색 결과 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTalents.map((talent) => (
          <div
            key={talent.id}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group"
          >
            {/* 비자 배지 (있을 경우만) */}
            {talent.visa && (
              <div className="absolute top-0 right-0 bg-teal-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                VISA: {talent.visa}
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl">
                <FiUser />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {talent.name}
                </h3>
                <p className="text-blue-600 font-medium text-sm">
                  {talent.role} | 경력 {talent.experience}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiClock className="shrink-0" /> {talent.location}
              </div>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <FiCheckCircle className="shrink-0" /> 검증된 신원 확인 완료
              </div>
            </div>

            {/* 태그 영역 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {talent.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 제안 버튼 */}
            <button className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <FiAward /> 채용 제안하기
            </button>
          </div>
        ))}
      </div>

      {/* 데이터 없을 때 예외 처리 */}
      {filteredTalents.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          해당 조건에 맞는 인재가 없습니다. 다른 키워드를 선택해 주세요.
        </div>
      )}
    </div>
  );
}
