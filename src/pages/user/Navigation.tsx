import { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Link 컴포넌트 추가
import { FiGlobe, FiChevronDown } from "react-icons/fi";
import { CATEGORY_MENU } from "../../constants/menuData";

const Navigation = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // 메뉴 데이터 (기존과 동일하지만 shared constant 사용)
  const menuData = CATEGORY_MENU.slice(0, 4); // 외국인 채용 제외하고 상위 4개만 메인 메뉴로 사용 (필요 시 조정)

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
                    className={`flex items-center gap-1 cursor-pointer text-sm lg:text-base transition-colors ${openMenu === menu.name
                      ? "text-blue-600"
                      : "hover:text-blue-600"
                      }`}
                  >
                    {menu.name}
                    <FiChevronDown
                      className={`transition-transform duration-200 ${openMenu === menu.name ? "rotate-180" : ""
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

          {/* 우측 사용자 정보 및 프로필 수정 버튼 */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              {/* localStorage에서 userProfile 읽어와서 표시 (실제로는 useEffect로 상태 관리 권장되지만, 여기선 간소화) */}
              {(() => {
                try {
                  const profileStr = localStorage.getItem("userProfile");
                  const profile = profileStr ? JSON.parse(profileStr) : null;
                  return profile ? (
                    <>
                      <span className="text-xs text-gray-400 font-medium">
                        {profile.name}님
                      </span>
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1 rounded font-bold border border-blue-100">
                        개인회원
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">게스트 모드</span>
                  );
                } catch (e) {
                  return <span className="text-xs text-gray-400">오류</span>;
                }
              })()}
            </div>
            <Link
              to="/user/profile"
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition shadow-md"
            >
              프로필 수정
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
