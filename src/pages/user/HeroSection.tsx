import { FiSearch } from "react-icons/fi";
import type { Dispatch, SetStateAction } from "react";

// UserLanding에서 보내주는 모든 값을 받을 수 있도록 인터페이스 수정
interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  onSearchAction: (filterValue: string) => void;
}

const HeroSection = ({
  searchQuery,
  setSearchQuery,
  onSearchAction,
}: HeroSectionProps) => {
  return (
    <div className="bg-slate-100 py-16 px-6 rounded-2xl">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          어떤 직무를 찾고 계신가요?
        </h2>
        <div className="relative flex items-center bg-white rounded-lg shadow-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <FiSearch className="ml-4 text-gray-400 text-xl" />
          <input
            type="text"
            value={searchQuery} // 상태 연동
            onChange={(e) => setSearchQuery(e.target.value)} // 입력 연동
            placeholder="직무, 회사명, 키워드를 입력하세요"
            className="w-full p-4 outline-none text-lg text-gray-700 bg-transparent"
          />
          <button
            onClick={() => onSearchAction("전체")} // 검색 실행
            className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-md whitespace-nowrap"
          >
            검색
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
          <span className="text-gray-400 font-medium">추천 키워드:</span>
          {["#급여협의", "#숙소제공", "#시간협의", "#기술직"].map((tag) => (
            <span
              key={tag}
              onClick={() => onSearchAction(tag)} // 태그 클릭 시 필터링 실행
              className="cursor-pointer text-gray-600 hover:text-blue-600 hover:font-bold transition-all px-2 py-1 bg-white/50 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
