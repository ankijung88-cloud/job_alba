import { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Link 컴포넌트 추가
import { FiGlobe, FiChevronDown } from "react-icons/fi";

const Navigation = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // 메뉴 데이터 (기존과 동일)
  const menuData = [
    {
      name: "채용정보",
      sub: [
        "직종별 전체",
        "산업별 전체",
        "테마별 채용",
        "브랜드 채용",
        "대기업 채용",
        "공공기관/공기업",
        "외국계 기업",
        "스타트업",
        "중견기업 채용",
        "신입/경력별",
      ],
    },
    {
      name: "지역별",
      sub: [
        "서울 전체",
        "경기 전체",
        "인천 전체",
        "강원/충청",
        "대전/세종",
        "광주/전라",
        "대구/경북",
        "부산/경남",
        "제도/강원",
        "역세권별",
      ],
    },
    {
      name: "단기알바",
      sub: [
        "하루알바",
        "주말알바",
        "심야알바",
        "새벽알바",
        "오전/오후",
        "행사보조",
        "전시/컨벤션",
        "물류/배송",
        "카페/서빙",
        "사무보조",
      ],
    },
    {
      name: "맞춤알바",
      sub: [
        "AI 추천 알바",
        "내 주변 알바",
        "관심 업종",
        "성별 맞춤",
        "연령대별",
        "거주지 인근",
        "전공/특기별",
        "자격증 우대",
        "병역특례",
        "급구 알바",
      ],
    },
    {
      name: "고객지원",
      sub: [
        "공지사항",
        "자주 묻는 질문",
        "1:1 문의",
        "이용가이드",
        "이벤트 소식",
        "제휴 제안",
        "채용 공고 등록",
        "권익보호센터",
        "뉴스레터 신청",
        "앱 다운로드",
      ],
    },
  ];

  const visaTypes = [
    { code: "E-9", name: "비전문취업" },
    { code: "H-2", name: "방문취업" },
    { code: "F-2", name: "거주" },
    { code: "F-4", name: "재외동포" },
    { code: "F-5", name: "영주" },
    { code: "F-6", name: "결혼이민" },
    { code: "D-2", name: "유학생" },
    { code: "D-10", name: "구직비자" },
    { code: "E-7", name: "특정활동" },
    { code: "G-1", name: "기타비자" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 relative w-full z-[100]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-[66px]">
          <div className="flex items-center gap-8">
            {/* 로고 클릭 시 홈으로 이동 */}
            <Link to="/UserLanding">
              <h1 className="text-2xl font-bold text-yellow-500 cursor-pointer">
                JOB-ALBA
              </h1>
            </Link>

            <ul className="hidden md:flex gap-6 font-semibold text-gray-700 items-center">
              {menuData.map((menu) => (
                <li
                  key={menu.name}
                  className="relative h-[66px] flex items-center"
                  onMouseEnter={() => setOpenMenu(menu.name)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <div
                    className={`flex items-center gap-1 cursor-pointer text-sm lg:text-base transition-colors ${
                      openMenu === menu.name
                        ? "text-blue-600"
                        : "hover:text-blue-600"
                    }`}
                  >
                    {menu.name}
                    <FiChevronDown
                      className={`transition-transform duration-200 ${
                        openMenu === menu.name ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* ✅ 일반 카테고리 드롭다운 연동 */}
                  {openMenu === menu.name && (
                    <ul className="absolute left-0 top-[66px] w-56 bg-white border border-gray-200 shadow-2xl rounded-lg py-3 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                      {menu.sub.map((item) => (
                        <li key={item} onClick={() => setOpenMenu(null)}>
                          <Link
                            to={`/category/${encodeURIComponent(
                              menu.name
                            )}/${encodeURIComponent(item)}`}
                            className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all border-l-2 border-transparent hover:border-blue-500"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

              {/* 외국인 채용 */}
              <li
                className="relative h-[66px] flex items-center"
                onMouseEnter={() => setOpenMenu("외국인")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="flex items-center gap-1 text-red-500 hover:text-red-600 font-bold text-sm lg:text-base">
                  <FiGlobe /> 외국인 채용 <FiChevronDown />
                </button>

                {/* ✅ 외국인 비자 카테고리 드롭다운 연동 */}
                {openMenu === "외국인" && (
                  <ul className="absolute left-0 top-[66px] w-56 bg-white border border-gray-200 shadow-2xl rounded-lg py-3 z-[100]">
                    <li className="px-5 py-1 text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                      Visa Category
                    </li>
                    {visaTypes.map((visa) => (
                      <li key={visa.code} onClick={() => setOpenMenu(null)}>
                        <Link
                          to={`/category/외국인채용/${visa.code}`}
                          className="px-5 py-2.5 hover:bg-red-50 cursor-pointer flex flex-col border-l-2 border-transparent hover:border-red-500 transition-all"
                        >
                          <span className="text-red-600 font-bold text-sm">
                            {visa.code}
                          </span>
                          <span className="text-gray-500 text-[11px]">
                            {visa.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* 우측 로그인/가입 영역 (기존 유지) */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-gray-100 p-1 rounded-lg gap-2">
              <button className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white shadow-sm hover:shadow-md transition-all rounded-md">
                구직자 로그인
              </button>
              <button className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white shadow-sm hover:shadow-md transition-all rounded-md">
                기업 로그인
              </button>
            </div>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700 transition">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
