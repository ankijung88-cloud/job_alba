import { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiBriefcase, FiUser, FiCheckCircle, FiFilter, FiDownload, FiX } from "react-icons/fi";
import ResumeView from "../../components/ResumeView";

// Mock User Interface (실제 데이터베이스에 있는 구조)
interface UserAccount {
    id: string;
    name: string;
    intro: string;
    // 현재 회원가입 시 받지 않는 추가 정보들 (추후 확장 가능성)
    [key: string]: any;
}

interface Talent {
    id: string; // User ID가 string이므로 변경
    name: string; // 익명 처리 (예: 김*수)
    age: number;
    gender: "남" | "여";
    career: "신입" | "1~3년" | "3~5년" | "5년 이상";
    education: "고졸" | "대졸(2,3년)" | "대졸(4년)" | "석박사";
    jobType: string;
    region: string;
    skills: string[];
    availableImmediately: boolean;
    hasPortfolio: boolean;
    salary: string; // 희망연봉
    title: string; // 한줄 소개
}

// 랜덤 데이터 생성을 위한 유틸리티
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const formatName = (name: string) => {
    if (name.length < 2) return name;
    return name[0] + "*" + name.slice(2);
};

// 기본 데이터셋 (랜덤 생성용)
const LOCATIONS = ["서울 강남구", "서울 마포구", "서울 서초구", "경기도 성남시", "경기도 평택시", "인천 연수구"];
const JOB_TYPES = ["프론트엔드 개발", "백엔드 개발", "UI/UX 디자인", "마케팅", "서비스 기획", "영업/기술영업"];
const SKILLS_POOL = ["React", "TypeScript", "Next.js", "Java", "Spring Boot", "AWS", "Figma", "Photoshop", "Python", "Node.js"];

interface TalentSearchBoardProps {
    subName: string;
}

export default function TalentSearchBoard({ subName }: TalentSearchBoardProps) {
    const [activeFilter, setActiveFilter] = useState("전체");
    const [allTalents, setAllTalents] = useState<Talent[]>([]);
    const [filteredTalents, setFilteredTalents] = useState<Talent[]>([]);

    // Resume Modal State
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [selectedResumeUser, setSelectedResumeUser] = useState<any>(null);

    const handleOpenResume = (userId: string) => {
        const usersStr = localStorage.getItem("db_users");
        if (usersStr) {
            const users = JSON.parse(usersStr);
            const user = users[userId];
            if (user) {
                // Ensure array for experiences if old data format
                if (!user.experiences && user.experience) {
                    user.experiences = user.experience.hasExperience ? [user.experience] : [];
                }
                setSelectedResumeUser(user);
                setShowResumeModal(true);
            } else {
                alert("사용자 정보를 찾을 수 없습니다.");
            }
        }
    };

    // 1. localStorage에서 실제 유저 데이터 로드 및 매핑
    useEffect(() => {
        const usersStr = localStorage.getItem("db_users");
        if (usersStr) {
            try {
                const usersMap: { [key: string]: UserAccount } = JSON.parse(usersStr);
                const userList = Object.values(usersMap);

                if (userList.length > 0) {
                    // UserAccount -> Talent 매핑 (부족한 정보는 랜덤 생성하여 데모 보완)
                    const mappedTalents: Talent[] = userList.map((user) => ({
                        id: user.id,
                        name: formatName(user.name),
                        age: getRandomInt(24, 35),
                        gender: Math.random() > 0.5 ? "남" : "여",
                        career: getRandomItem(["신입", "1~3년", "3~5년", "5년 이상"]),
                        education: getRandomItem(["고졸", "대졸(2,3년)", "대졸(4년)", "석박사"]),
                        jobType: getRandomItem(JOB_TYPES),
                        region: getRandomItem(LOCATIONS),
                        skills: [getRandomItem(SKILLS_POOL), getRandomItem(SKILLS_POOL)],
                        availableImmediately: Math.random() > 0.7,
                        hasPortfolio: Math.random() > 0.5,
                        salary: `${getRandomInt(3000, 6000)}만원`,
                        title: user.intro || "자기소개가 아직 없습니다.",
                    }));
                    setAllTalents(mappedTalents);
                } else {
                    setAllTalents([]); // 유저가 없을 경우
                }
            } catch (e) {
                console.error("Failed to parse db_users", e);
                setAllTalents([]);
            }
        }
    }, []);

    // 2. 서브메뉴(subName) 및 allTalents 변경 시 필터링 수행
    useEffect(() => {
        if (allTalents.length === 0) {
            setFilteredTalents([]);
            return;
        }

        let result = [...allTalents];
        let filterName = "전체";

        switch (subName) {
            case "전체 인재정보":
                filterName = "전체";
                break;
            case "직종별 인재":
                filterName = "직종";
                break;
            case "지역별 인재":
                filterName = "지역";
                break;
            case "신입/경력별":
                filterName = "경력";
                break;
            case "학력별 검색":
                filterName = "학력";
                break;
            case "보유 자격증별":
                filterName = "자격증";
                break;
            case "포트폴리오 등록자":
                filterName = "포트폴리오";
                result = result.filter(t => t.hasPortfolio);
                break;
            case "즉시 출근 가능자":
                filterName = "즉시출근";
                result = result.filter(t => t.availableImmediately);
                break;
            case "인재 매칭 추천":
                filterName = "추천";
                // (Mock) 경력직 위주 추천
                result = result.filter(t => t.career !== "신입");
                break;
            case "최근 본 인재":
                filterName = "최근";
                result = result.slice(0, 2);
                break;
            default:
                filterName = "전체";
        }

        setActiveFilter(filterName);
        setFilteredTalents(result);
    }, [subName, allTalents]);

    return (
        <div className="space-y-6">
            {/* 상단 필터 요약 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <FiFilter className="text-blue-600" />
                        <span className="text-gray-900">{subName}</span>
                        <span className="text-gray-400 text-sm font-normal">
                            조건에 맞는 인재 <strong className="text-blue-600">{filteredTalents.length}</strong>명을 찾았습니다.
                        </span>
                    </h3>
                    <div className="flex gap-2">
                        {activeFilter !== "전체" && (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                                #{activeFilter} 필터 적용중
                            </span>
                        )}
                    </div>
                </div>

                {/* 상세 검색 필터 UI */}
                <div className="flex flex-wrap gap-2 text-sm">
                    {["직종", "지역", "경력", "학력"].map((filter) => (
                        <button
                            key={filter}
                            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === filter
                                ? "bg-gray-800 text-white border-gray-800"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                                }`}
                        >
                            {filter} 선택
                        </button>
                    ))}
                    <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400">
                        <FiSearch className="inline mr-1" /> 키워드 검색
                    </button>
                </div>
            </div>

            {/* 인재 리스트 */}
            <div className="grid grid-cols-1 gap-4">
                {filteredTalents.length > 0 ? (
                    filteredTalents.map((talent) => (
                        <div key={talent.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start md:items-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold text-gray-500 group-hover:from-blue-100 group-hover:to-blue-200 group-hover:text-blue-600 transition-colors">
                                {talent.name[0]}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-lg font-bold text-gray-900">
                                        {talent.name} <span className="text-sm font-normal text-gray-500">({talent.gender}, {talent.age}세)</span>
                                    </h4>
                                    {talent.availableImmediately && (
                                        <span className="bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                            <FiCheckCircle size={10} /> 즉시출근
                                        </span>
                                    )}
                                    {talent.hasPortfolio && (
                                        <span className="bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                            <FiDownload size={10} /> 포트폴리오
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-800 font-medium">
                                    {talent.title}
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><FiBriefcase size={14} /> {talent.career}</span>
                                    <span className="flex items-center gap-1"><FiUser size={14} /> {talent.education}</span>
                                    <span className="flex items-center gap-1"><FiMapPin size={14} /> {talent.region}</span>
                                    <span className="text-blue-600 font-bold">{talent.salary}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {talent.skills.map((skill, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full md:w-auto flex md:flex-col gap-2">
                                <button
                                    onClick={() => handleOpenResume(talent.id)}
                                    className="flex-1 md:flex-none border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                                >
                                    인재 정보 열람
                                </button>
                                <button
                                    onClick={() => {
                                        const companyProfileStr = localStorage.getItem("companyProfile");
                                        if (!companyProfileStr) {
                                            alert("기업 회원만 이용 가능합니다. 로그인 해주세요.");
                                            return;
                                        }
                                        const company = JSON.parse(companyProfileStr);

                                        const proposal = {
                                            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                                            companyId: company.id,
                                            companyName: company.companyName,
                                            userId: talent.id,
                                            userName: talent.name,
                                            type: "INTERVIEW",
                                            status: "PENDING",
                                            createdAt: new Date().toISOString()
                                        };

                                        const proposalsStr = localStorage.getItem("db_proposals");
                                        const proposals = proposalsStr ? JSON.parse(proposalsStr) : [];
                                        proposals.push(proposal);
                                        localStorage.setItem("db_proposals", JSON.stringify(proposals));

                                        alert(`[관리자 전송 완료]\n'${talent.name}'님께 면접 제안을 요청했습니다.\n관리자 검토 후 전달됩니다.`);
                                    }}
                                    className="flex-1 md:flex-none bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                    면접 제안
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <FiUser className="mx-auto text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500 font-bold">등록된 개인회원 정보가 없거나 조건에 맞는 인재가 없습니다.</p>
                        <p className="text-xs text-gray-400 mt-2">회원가입(User Signup)을 진행하면 이곳에 표시됩니다.</p>
                    </div>
                )}
            </div>
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
                        <ResumeView user={selectedResumeUser} isRestricted={true} />
                    </div>
                </div>
            )}
        </div>
    );
}
