import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiPlus, FiInfo, FiCheckCircle } from "react-icons/fi";

interface InsuranceGuide {
    id: number;
    category: "국민연금" | "건강보험" | "고용보험" | "산재보험" | "공통";
    title: string;
    content: string;
    date: string;
    author: string;
}

const INITIAL_GUIDES: InsuranceGuide[] = [
    {
        id: 1,
        category: "국민연금",
        title: "2025년 국민연금 기준소득월액 상·하한액 및 요율 안내",
        content: `
      1. 연금보험료율: 9% (사업장가입자: 사용자 4.5%, 근로자 4.5%)
      2. 기준소득월액 상/하한액 (2025.7월 변동 예정, 현재 기준)
         - 하한액: 390,000원
         - 상한액: 6,170,000원
      
      * 60세 미만(1965년생 이후) 근로자 대상 적용.
    `,
        date: "2025-01-02",
        author: "관리자",
    },
    {
        id: 2,
        category: "건강보험",
        title: "2025년 건강보험료 및 장기요양보험료율",
        content: `
      1. 건강보험료율: 7.09% (동결)
         - 근로자 부담: 3.545%
         - 사용자 부담: 3.545%
      
      2. 장기요양보험료율: 건강보험료의 12.95% (또는 소득월액의 0.9182%)
         - 근로자/사용자 각각 50% 부담
    `,
        date: "2025-01-02",
        author: "관리자",
    },
    {
        id: 3,
        category: "고용보험",
        title: "2025년 고용보험 실업급여 요율 안내",
        content: `
      1. 실업급여 요율: 1.8%
         - 근로자: 0.9%
         - 사업주: 0.9%
      
      2. 고용안정/직업능력개발사업 (사업주 전액 부담)
         - 150인 미만 기업: 0.25%
         - 150인 이상(우선지원대상기업): 0.45%
         - 150인 이상 ~ 1000인 미만: 0.65%
         - 1000인 이상 / 지자체 등: 0.85%
    `,
        date: "2025-01-02",
        author: "관리자",
    },
    {
        id: 4,
        category: "산재보험",
        title: "2025년 산재보험 요율 (업종별 상이)",
        content: `
      - 산재보험료는 사업주가 전액 부담합니다.
      - 업종별 보험료율 + 출퇴근재해 요율(0.6/1000) 합산 적용.
      - 2025년 평균 산재보험료율: 1.47% (예상)
      
      * 정확한 요율은 근로복지공단 '고용·산재보험 토탈서비스'에서 확인 필요.
    `,
        date: "2025-01-02",
        author: "관리자",
    },
];

export default function InsuranceGuideBoard() {
    const [guides, setGuides] = useState<InsuranceGuide[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        // localStorage에서 데이터 로드, 없으면 초기값 사용
        const saved = localStorage.getItem("db_insurance_guides");
        if (saved) {
            setGuides(JSON.parse(saved));
        } else {
            setGuides(INITIAL_GUIDES);
            localStorage.setItem("db_insurance_guides", JSON.stringify(INITIAL_GUIDES));
        }
    }, []);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleWrite = () => {
        const title = prompt("등록할 안내사항 제목을 입력하세요:");
        if (!title) return;

        const content = prompt("내용을 입력하세요:");
        if (!content) return;

        const newGuide: InsuranceGuide = {
            id: Date.now(),
            category: "공통",
            title,
            content,
            date: new Date().toISOString().split("T")[0],
            author: "관리자",
        };

        const newGuides = [newGuide, ...guides];
        setGuides(newGuides);
        localStorage.setItem("db_insurance_guides", JSON.stringify(newGuides));
        alert("새 공지사항이 등록되었습니다.");
        setExpandedId(newGuide.id); // 등록 후 자동 펼침
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "국민연금": return "bg-orange-100 text-orange-700 border-orange-200";
            case "건강보험": return "bg-green-100 text-green-700 border-green-200";
            case "고용보험": return "bg-blue-100 text-blue-700 border-blue-200";
            case "산재보험": return "bg-purple-100 text-purple-700 border-purple-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            {/* 상단 안내 및 글쓰기 버튼 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FiInfo className="text-blue-600" /> 4대보험 실무 안내
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        2025년 적용되는 4대보험 요율 및 실무 가이드를 확인하세요.
                    </p>
                </div>
                <button
                    onClick={handleWrite}
                    className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-md text-sm"
                >
                    <FiPlus /> 안내사항 등록
                </button>
            </div>

            {/* 가이드 리스트 (Accordion) */}
            <div className="space-y-4">
                {guides.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white rounded-2xl border transition-all overflow-hidden ${expandedId === item.id
                            ? "border-blue-300 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        {/* 헤더 */}
                        <div
                            onClick={() => toggleExpand(item.id)}
                            className="p-6 cursor-pointer flex justify-between items-start gap-4 select-none"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 text-[11px] font-bold rounded border ${getCategoryColor(item.category)}`}>
                                        {item.category}
                                    </span>
                                    <span className="text-gray-400 text-xs flex items-center gap-1">
                                        <FiCheckCircle size={12} /> {item.date}
                                    </span>
                                </div>
                                <h4 className={`text-lg font-bold transition-colors ${expandedId === item.id ? "text-blue-700" : "text-gray-800"}`}>
                                    {item.title}
                                </h4>
                            </div>
                            <button className="text-gray-400 mt-1 transition-transform duration-200">
                                {expandedId === item.id ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                            </button>
                        </div>

                        {/* 상세 내용 (펼쳐짐) */}
                        {expandedId === item.id && (
                            <div className="px-6 pb-8 pt-2 border-t border-gray-100 bg-gray-50/30">
                                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    {item.content}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <span className="text-xs text-gray-400 font-medium">
                                        작성자: {item.author}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
