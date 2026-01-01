import { useState, useEffect } from "react";
import { FiUser, FiCheckCircle, FiAward, FiPhone, FiMail, FiX } from "react-icons/fi";
import ResumeView from "../../components/ResumeView";

// 인재 데이터 타입 정의 (실제 User 데이터와 매핑)
interface Talent {
  id: string;
  name: string;
  role?: string; // intro로 대체
  experience?: string;
  tags?: string[];
  location?: string;
  visa?: string;
  phone?: string;
  email?: string;
  info?: string; // intro
  intro?: string; // ✅ Added this line
}

interface TalentSearchProps {
  talents?: any[]; // 부모로부터 전달받은 리얼 유저 데이터
  searchQuery?: string;
}

export default function TalentSearch({ talents = [], searchQuery = "" }: TalentSearchProps) {
  // 1. 상태 관리: 현재 선택된 필터 (기본값: 전체)
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [filteredList, setFilteredList] = useState<Talent[]>([]);

  // Resume Modal State
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedResumeUser, setSelectedResumeUser] = useState<any>(null);

  // 2. 데이터 필터링 로직
  useEffect(() => {
    let results = talents.map(user => ({
      id: user.id,
      name: user.name,
      role: user.intro || "자기소개가 없습니다.",
      experience: "신입/경력", // 데이터 없음, 기본값
      tags: ["#구직중"], // 기본 태그
      location: "지역 무관", // 데이터 없음, 기본값
      phone: user.phone,
      email: user.email,
      intro: user.intro
    }));

    // 2-1. 검색어 필터 (props로 받은 searchQuery)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(t =>
        t.name.toLowerCase().includes(query) ||
        (t.intro && t.intro.toLowerCase().includes(query)) ||
        (t.phone && t.phone.includes(query))
      );
    }

    // 2-2. 태그 필터 (내부 상태)
    if (selectedFilter !== "전체") {
      // 태그 데이터가 없으므로 현재는 더미 로직 혹은 태그가 없으므로 필터링 시 결과 0개 가능성 있음.
      // 하지만 UI 구색을 맞추기 위해 임시로 '전체'가 아니면 빈배열 혹은 특정 로직 추가 가능.
      // 요청사항은 "키워드가 등록된 인재 정보"를 보여달라는 것이므로,
      // 만약 사용자가 '태그'를 입력한게 아니라면 여기선 무시하거나,
      // 또는 UserProfile에 태그가 없으므로 일단 '전체'만 보여주는게 안전.
      // 그러나 기존 UI 버튼이 있으므로...
      // 일단 필터를 누르면 해당 텍스트가 포함된 사람을 찾도록 함 (intro 검색)
      results = results.filter(t =>
        (t.intro && t.intro.includes(selectedFilter.replace("#", ""))) ||
        (t.tags && t.tags.includes(selectedFilter))
      );
    }

    setFilteredList(results);

  }, [talents, searchQuery, selectedFilter]);


  const filterButtons = [
    "전체",
    "#성실함",
    "#경력",
    "#즉시출근", // 유저 데이터에 없으므로 실제론 안걸릴 수 있음
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 min-h-screen">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          비즈니스 맞춤 인재 검색
        </h2>
        <p className="text-gray-600">
          조건에 맞는 최적의 근로자를 빠르게 찾아보세요.
          {searchQuery && <span className="block mt-2 text-blue-600 font-bold">"{searchQuery}" 검색 결과 ({filteredList.length}명)</span>}
        </p>
      </div>

      {/* 퀵 필터 버튼 영역 */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {filterButtons.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-6 py-2 rounded-full font-medium transition-all shadow-sm ${selectedFilter === filter
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
        {filteredList.map((talent) => (
          <div
            key={talent.id}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group"
          >
            {/* 비자 배지 (있을 경우만) - 현재 데이터 없음 */}
            {/* 
            {talent.visa && (
              <div className="absolute top-0 right-0 bg-teal-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                VISA: {talent.visa}
              </div>
            )}
            */}

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl">
                <FiUser />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {talent.name} <span className="text-xs text-gray-400 font-normal">(개인회원)</span>
                </h3>
                <p className="text-blue-600 font-medium text-sm line-clamp-1">
                  {talent.role}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiPhone className="shrink-0" /> {talent.phone}
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="shrink-0" /> {talent.email}
              </div>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <FiCheckCircle className="shrink-0" /> 신원 확인 완료
              </div>
            </div>

            {/* 태그 영역 - 임시 */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded font-medium">#구직중</span>
              {talent.intro && talent.intro.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded font-medium line-clamp-1">#{talent.intro.slice(0, 5)}...</span>
              )}
            </div>

            {/* 제안 버튼 */}
            <div className="flex gap-2 w-full mt-4">
              <button
                onClick={() => {
                  // Find full user data from localStorage to pass to ResumeView
                  const usersStr = localStorage.getItem("db_users");
                  if (usersStr) {
                    const users = JSON.parse(usersStr);
                    const fullUser = users[talent.id];
                    if (fullUser) {
                      setSelectedResumeUser(fullUser);
                      setShowResumeModal(true);
                    }
                  }
                }}
                className="flex-1 py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                이력서 보기
              </button>
              <button
                onClick={() => {
                  const companyProfileStr = localStorage.getItem("companyProfile");
                  if (!companyProfileStr) {
                    alert("기업 회원만 이용 가능합니다. 로그인 해주세요.");
                    // navigate("/Login"); // 필요 시 import 필요
                    return;
                  }
                  const company = JSON.parse(companyProfileStr);

                  const proposal = {
                    id: Date.now().toString(),
                    companyId: company.id,
                    companyName: company.companyName,
                    userId: talent.id,
                    userName: talent.name,
                    type: "HIRING",
                    status: "PENDING",
                    createdAt: new Date().toISOString()
                  };

                  const proposalsStr = localStorage.getItem("db_proposals");
                  const proposals = proposalsStr ? JSON.parse(proposalsStr) : [];
                  proposals.push(proposal);
                  localStorage.setItem("db_proposals", JSON.stringify(proposals));

                  alert(`[관리자 전송 완료]\n'${talent.name}'님께 채용 제안을 요청했습니다.\n관리자 검토 후 전달됩니다.`);
                }}
                className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <FiAward /> 채용 제안하기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 데이터 없을 때 예외 처리 */}
      {filteredList.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          조건에 맞는 인재가 없습니다.
        </div>
      )}
      {/* Resume Modal */}
      {showResumeModal && selectedResumeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
            <button
              onClick={() => setShowResumeModal(false)}
              className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <FiX size={24} />
            </button>
            <ResumeView user={selectedResumeUser} />
          </div>
        </div>
      )}
    </div>
  );
}
