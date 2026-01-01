import { FiSearch } from "react-icons/fi";

// 1. Props의 타입을 정의합니다.
interface HeroSectionProps {
  onSearchClick: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

// 2. 정의한 타입을 컴포넌트에 적용하고 구조 분해 할당으로 가져옵니다.
const HeroSection = ({ onSearchClick, searchQuery, setSearchQuery }: HeroSectionProps) => {
  return (
    <div className="bg-slate-100 py-16 px-6 rounded-2xl">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 leading-tight">
          귀사의 성장을 함께할 <br className="sm:hidden" />
          <span className="text-blue-600">최적의 인재</span>를 찾아보세요.
        </h2>

        <div className="relative flex items-center bg-white rounded-xl shadow-xl p-2 border-2 border-transparent focus-within:border-blue-500 transition-all">
          <FiSearch className="ml-4 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="이름, 한줄 소개, 전화번호로 인재를 검색해보세요"
            className="w-full p-4 outline-none text-lg text-gray-700"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearchClick()}
          />
          {/* 3. 전달받은 함수를 버튼에 연결합니다. */}
          <button
            onClick={onSearchClick}
            className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-md whitespace-nowrap"
          >
            검색
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
          <span className="text-gray-400 font-medium">추천 키워드:</span>
          {["#즉시출근", "#경력보유", "#6개월이상", "#비자확인완료"].map(
            (tag) => (
              <span
                key={tag}
                onClick={onSearchClick}
                className="cursor-pointer text-gray-600 hover:text-blue-600 hover:font-bold transition-all"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
