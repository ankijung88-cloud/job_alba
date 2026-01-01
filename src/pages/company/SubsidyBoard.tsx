import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiExternalLink, FiInfo, FiTag } from "react-icons/fi";

interface Subsidy {
    id: number;
    title: string;
    agency: string;
    target: string;
    content: string;
    period: string;
    status: "접수중" | "마감임박" | "마감" | "예정";
    link: string;
}

const SUBSIDIES: Subsidy[] = [
    {
        id: 1,
        title: "2025년 청년일자리도약장려금",
        agency: "고용노동부",
        target: "5인 이상 우선지원대상기업 (취업애로청년 정규직 채용)",
        content: "취업애로청년을 정규직으로 채용하고 6개월 이상 고용 유지 시, 최장 2년간 최대 1,200만원 지원 (월 최대 60만원 x 1년 + 2년차 반기 240만원)",
        period: "2025.01.01 ~ 예산 소진 시",
        status: "접수중",
        link: "#",
    },
    {
        id: 2,
        title: "고령자 계속고용장려금",
        agency: "고용노동부",
        target: "정년 도래 근로자를 계속 고용하는 중소/중견기업",
        content: "정년에 도달한 근로자를 재고용하거나 정년을 연장/폐지하는 경우, 근로자 1인당 월 30만원씩 최대 2년간 지원",
        period: "상시 접수",
        status: "접수중",
        link: "#",
    },
    {
        id: 3,
        title: "일·가정 양립 지원금 (육아휴직 부여 등)",
        agency: "고용노동부",
        target: "근로자에게 육아휴직 등을 허용한 우선지원대상기업",
        content: "육아휴직 허용 시 월 30만원(만 12개월 이내 자녀는 월 200만원 특례 적용 가능) 지원, 대체인력 채용 시 인건비 지원",
        period: "2025.01 ~ 2025.12",
        status: "접수중",
        link: "#",
    },
    {
        id: 4,
        title: "중소기업 디지털 전환 지원사업",
        agency: "중소벤처기업부",
        target: "디지털 전환을 희망하는 제조 소기업",
        content: "스마트공장 구축 및 고도화 비용 지원, 클라우드 서비스 이용료 바우처 제공 (기업당 최대 5천만원)",
        period: "2025.03 예정",
        status: "예정",
        link: "#",
    },
    {
        id: 5,
        title: "2024년 청년내일채움공제 (신규 가입 중단)",
        agency: "고용노동부",
        target: "신규 가입 불가 (기존 가입자 유지)",
        content: "2024년부터 신규 가입이 중단되었습니다. (유사 사업: 청년일자리도약장려금 활용 권장)",
        period: "마감",
        status: "마감",
        link: "#",
    },
];

export default function SubsidyBoard() {
    const [expandedId, setExpandedId] = useState<number | null>(1); // 첫 번째 항목 기본 펼침

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "접수중": return "bg-blue-100 text-blue-700 border-blue-200";
            case "마감임박": return "bg-red-100 text-red-700 border-red-200";
            case "예정": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default: return "bg-gray-100 text-gray-500 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            {/* 알림 배너 */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <FiInfo size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">2025년 주요 정부지원금 안내</h3>
                    <p className="text-gray-600 text-sm mt-1">
                        기업 운영에 도움이 되는 핵심 지원사업을 선별하여 안내해 드립니다.
                        자세한 내용은 각 사업별 신청 바로가기를 통해 확인하세요.
                    </p>
                </div>
            </div>

            {/* 지원금 리스트 (Accordion) */}
            <div className="space-y-4">
                {SUBSIDIES.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white rounded-2xl border transition-all overflow-hidden ${expandedId === item.id
                                ? "border-blue-200 shadow-md ring-1 ring-blue-100"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                    >
                        {/* 헤더 */}
                        <div
                            onClick={() => toggleExpand(item.id)}
                            className="p-6 cursor-pointer flex justify-between items-start gap-4"
                        >
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 text-[11px] font-bold rounded border ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                    <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
                                        <FiTag size={10} /> {item.agency}
                                    </span>
                                </div>
                                <h4 className={`text-lg font-bold transition-colors ${expandedId === item.id ? "text-blue-700" : "text-gray-800"}`}>
                                    {item.title}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1 truncate">
                                    {item.target}
                                </p>
                            </div>
                            <button className="text-gray-400 mt-1">
                                {expandedId === item.id ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                            </button>
                        </div>

                        {/* 상세 내용 (펼쳐짐) */}
                        {expandedId === item.id && (
                            <div className="px-6 pb-6 pt-0 border-t border-blue-50 bg-blue-50/10">
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <strong className="block text-sm text-gray-900 mb-1">📌 지원 내용</strong>
                                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                            {item.content}
                                        </p>
                                    </div>
                                    <div>
                                        <strong className="block text-sm text-gray-900 mb-1">📅 신청 기간</strong>
                                        <p className="text-gray-600 text-sm">
                                            {item.period}
                                        </p>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                alert("해당 기관의 신청 페이지로 이동합니다. (외부 링크)");
                                            }}
                                            className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm"
                                        >
                                            상세보기 및 신청 <FiExternalLink />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
