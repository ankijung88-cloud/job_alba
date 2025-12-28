import { useState } from "react";
// 1. useNavigate를 react-router-dom에서 불러와야 합니다.
import { useNavigate } from "react-router-dom";
import { FiGlobe, FiChevronDown, FiBriefcase } from "react-icons/fi";

const CompanyNavigation = () => {
  // 2. 컴포넌트 내부에서 navigate 함수를 선언해야 합니다.
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // 기업 서비스 관점의 실질적인 메뉴 데이터
  const menuData = [
    {
      name: "공고관리",
      sub: [
        "채용공고 등록",
        "진행중인 공고",
        "마감된 공고",
        "임시저장 공고",
        "공고 복사 등록",
        "공고 템플릿 관리",
        "지원 양식 설정",
        "스크랩한 인재",
        "공고 통계 분석",
        "자동 마감 설정",
      ],
    },
    {
      name: "인재검색",
      sub: [
        "전체 인재정보",
        "직종별 인재",
        "지역별 인재",
        "신입/경력별",
        "학력별 검색",
        "보유 자격증별",
        "포트폴리오 등록자",
        "즉시 출근 가능자",
        "인재 매칭 추천",
        "최근 본 인재",
      ],
    },
    {
      name: "지원자관리",
      sub: [
        "미열람 지원자",
        "서류 합격자",
        "면접 대기자",
        "최종 합격 관리",
        "불합격 통보",
        "면접 일정 조율",
        "화상 면접 개설",
        "평판 조회 요청",
        "채용 확정 보고",
        "지원자 DB 백업",
      ],
    },
    {
      name: "유료서비스",
      sub: [
        "메인 최상단 광고",
        "급구 공고 강조",
        "인재 연락처 열람권",
        "공고 자동 점프",
        "타겟팅 알림 발송",
        "기업 브랜드 홍보",
        "서비스 이용권 구매",
        "결제 내역 관리",
        "세금계산서 발행",
        "비즈 머니 충전",
      ],
    },
    {
      name: "기업지원",
      sub: [
        "인사노무 상담",
        "근로계약서 양식",
        "최저임금 계산기",
        "4대보험 안내",
        "정부지원금 안내",
        "기업 정보 수정",
        "계정 보안 설정",
        "권한 관리(멤버)",
        "고객센터 문의",
        "서비스 개선 제안",
      ],
    },
  ];

  const foreignRecruit = [
    { code: "Visa-Check", name: "비자 진위 확인" },
    { code: "Language", name: "언어능력별 검색" },
    { code: "E-9-Manage", name: "고용허가제 안내" },
    { code: "F-4-Recruit", name: "동포 채용 관리" },
    { code: "D-2-PartTime", name: "유학생 시간제 취업" },
    { code: "Contract", name: "표준근로계약(영문)" },
    { code: "Support", name: "외국인 등록 지원" },
    { code: "Tax", name: "외국인 근로소득세" },
    { code: "Insurance", name: "외국인 전용 보험" },
    { code: "Counsel", name: "통번역 서비스" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-[70px]">
          <div className="flex items-center gap-8">
            <h1
              onClick={() => navigate("/CompanyLanding")} // 클릭 시 기업 랜딩으로 이동 예시
              className="text-2xl font-black text-blue-800 cursor-pointer tracking-tighter flex items-center gap-1"
            >
              <FiBriefcase className="text-blue-600" /> JOB-ALBA{" "}
            </h1>

            <ul className="hidden xl:flex gap-8 font-bold text-gray-700 items-center">
              {menuData.map((menu) => (
                <li
                  key={menu.name}
                  className="relative h-[70px] flex items-center"
                  onMouseEnter={() => setOpenMenu(menu.name)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <div
                    className={`flex items-center gap-1 cursor-pointer text-base transition-colors ${
                      openMenu === menu.name
                        ? "text-blue-600"
                        : "hover:text-blue-600"
                    }`}
                  >
                    {menu.name}{" "}
                    <FiChevronDown
                      className={`transition-transform duration-200 ${
                        openMenu === menu.name ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {openMenu === menu.name && (
                    <ul className="absolute left-0 top-[70px] w-60 bg-white border border-gray-200 shadow-2xl rounded-b-xl py-4 z-[100] grid grid-cols-1 divide-y divide-gray-50">
                      {menu.sub.map((item) => (
                        <li
                          key={item}
                          onClick={() =>
                            navigate(
                              `/company/category/${encodeURIComponent(
                                menu.name
                              )}/${encodeURIComponent(item)}`
                            )
                          }
                          className="px-6 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          {item}
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                            ▶
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

              <li
                className="relative h-[70px] flex items-center border-l pl-8"
                onMouseEnter={() => setOpenMenu("외국인지원")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-bold">
                  <FiGlobe /> 외국인 고용지원 <FiChevronDown />
                </button>

                {openMenu === "외국인지원" && (
                  <ul className="absolute left-0 top-[70px] w-60 bg-white border border-gray-200 shadow-2xl rounded-b-xl py-4 z-[100]">
                    {foreignRecruit.map((item) => (
                      <li
                        key={item.code}
                        onClick={() =>
                          navigate(`/company/foreign/${item.code}`)
                        } // 예시 경로
                        className="px-6 py-2.5 hover:bg-teal-50 cursor-pointer flex flex-col transition-all border-l-4 border-transparent hover:border-teal-500"
                      >
                        <span className="text-teal-700 font-bold text-sm">
                          {item.code}
                        </span>
                        <span className="text-gray-500 text-[11px]">
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs text-gray-400 font-medium">
                테크컴퍼니님
              </span>
              <span className="text-[10px] bg-gray-100 px-1 rounded text-gray-600 font-bold">
                기업회원
              </span>
            </div>
            <button
              onClick={() => navigate("/company/post")} // 공고등록 페이지 이동
              className="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-900 transition shadow-md"
            >
              공고등록
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CompanyNavigation;
