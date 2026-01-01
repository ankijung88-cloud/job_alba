import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// 1. 기업용 네비게이션을 가져옵니다. (파일명이 CompanyNavigation인지 확인하세요)
import CompanyNavigation from "./CompanyNavigation";
import LaborContractBoard from "./LaborContractBoard";
import MinimumWageCalculator from "./MinimumWageCalculator";
import SubsidyBoard from "./SubsidyBoard";
import InsuranceGuideBoard from "./InsuranceGuideBoard";
import TalentSearchBoard from "./TalentSearchBoard";
import {
  FiArrowRight,
  FiPlus,
  FiSearch,
  FiFileText,
  FiUserCheck,
  FiSettings,
  FiMoreVertical,
  FiEye,
} from "react-icons/fi";

// ⚠️ 절대 여기서 CategoryPage나 C_CategoryPage를 자기 자신으로 import 하지 마세요!

const C_CategoryPage = () => {
  const { menuName, subName } = useParams<{
    menuName: string;
    subName: string;
  }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const decodedMenu = decodeURIComponent(menuName || "");
  const decodedSub = decodeURIComponent(subName || "");

  // "공고관리" 메뉴의 특정 서브메뉴일 경우 대시보드 컴포넌트(혹은 리스트)를 보여주기 위한 로직
  // 여기서는 간단히 리다이렉트하거나 조건부 렌더링을 할 수 있습니다. 
  // 사용자가 "채용공고 등록", "진행중인 공고", "마감된 공고" 등을 클릭했을 때 Dashboard로 보내되, 
  // 탭 상태를 같이 전달하면 좋겠지만, 현재 Dashboard는 내부 state로 탭을 관리함.
  // 따라서, 여기서는 Dashboard를 직접 렌더링하거나 Navigate로 이동시킵니다.
  // 사용자 요구: "채용공고 등록리스트"와 "진행중인 공고 리스트"에도 등록된 공고가 업데이트되어 보여지도록.
  // 즉, 이 페이지에서 해당 리스트를 보여주거나, Dashboard를 재활용해야 함.

  // 만약 "채용공고 등록"이 "새 글 쓰기"가 아니라 "등록한 글 리스트"를 의미한다면 Dashboard 연결이 맞음.
  // 하지만 "채용공고 등록" 텍스트 자체는 보통 Action을 의미함. 
  // 네비게이션 구조상 "공고관리" -> "채용공고 등록" 이라는 메뉴가 있다면, 
  // 1. 새 글 쓰기 폼으로 이동? OR 2. 등록 내역 리스트?
  // 사용자 요청: "채용공고 등록리스트... 에도 등록된 공고가 업데이트되어... 보여지도록" 
  // -> 리스트 조회 페이지로 해석됨.

  useEffect(() => {
    if (decodedMenu === "공고관리") {
      if (decodedSub === "채용공고 등록" || decodedSub === "진행중인 공고") {
        // 대시보드로 이동 (쿼리 파라미터로 탭 전달 가능하면 좋음, 지금은 그냥 이동)
        navigate('/company/Dashboard');
        return;
      }
      if (decodedSub === "마감된 공고") {
        // 마감된 공고 탭을 보여주고 싶지만, Dashboard 구현상 state로만 관리됨.
        // 일단 Dashboard로 이동. 개선시 Dashboard가 URL query param을 읽도록 수정 필요.
        navigate('/company/Dashboard');
        return;
      }
    }
  }, [decodedMenu, decodedSub, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [menuName, subName]);

  const getMenuTheme = () => {
    switch (decodedMenu) {
      case "공고관리":
        return {
          icon: <FiFileText />,
          color: "blue",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
          accentColor: "bg-blue-600",
          desc: "등록하신 채용공고의 현황을 파악하고 관리합니다.",
        };
      case "인재검색":
        return {
          icon: <FiSearch />,
          color: "teal",
          bgColor: "bg-teal-50",
          textColor: "text-teal-600",
          accentColor: "bg-teal-600",
          desc: "조건에 맞는 최적의 인재를 실시간으로 검색합니다.",
        };
      case "지원자관리":
        return {
          icon: <FiUserCheck />,
          color: "indigo",
          bgColor: "bg-indigo-50",
          textColor: "text-indigo-600",
          accentColor: "bg-indigo-600",
          desc: "우리 공고에 지원한 인재들의 채용 프로세스를 관리합니다.",
        };
      case "기업지원":
        return {
          icon: <FiSettings />,
          color: "gray",
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
          accentColor: "bg-gray-800",
          desc: "기업 운영에 필요한 각종 서비스를 제공합니다.",
        };
      default:
        return {
          icon: <FiSettings />,
          color: "gray",
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
          accentColor: "bg-gray-800",
          desc: "기업 운영에 필요한 각종 서비스를 제공합니다.",
        };
    }
  };

  const theme = getMenuTheme();

  const renderContent = () => {
    if (decodedMenu === "기업지원" && decodedSub === "근로계약서 양식") {
      return <LaborContractBoard />;
    }

    if (decodedMenu === "기업지원" && decodedSub === "최저임금 계산기") {
      return <MinimumWageCalculator />;
    }

    if (decodedMenu === "기업지원" && decodedSub === "4대보험 안내") {
      return <InsuranceGuideBoard />;
    }

    if (decodedMenu === "기업지원" && decodedSub === "정부지원금 안내") {
      return <SubsidyBoard />;
    }

    if (isLoading) {
      return (
        <div className="p-12 grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-50 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (decodedMenu === "공고관리") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase font-bold">
                <th className="px-8 py-5">공고명 / 등록일</th>
                <th className="px-8 py-5">조회수</th>
                <th className="px-8 py-5">지원자</th>
                <th className="px-8 py-5">상태</th>
                <th className="px-8 py-5 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3].map((i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                      [신입/경력] {decodedSub} 관련 전문가 채용 공고 {i}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      등록일: 2025.12.20
                    </p>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                    1,240회
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      12명
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-2 py-1 bg-green-50 text-green-600 text-[11px] font-bold rounded">
                      게시중
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
                      <FiMoreVertical className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (decodedMenu === "인재검색") {
      return <TalentSearchBoard subName={decodedSub} />;
    }

    /* if (decodedMenu === "지원자관리") {
      return <ApplicantManager />;
    } */

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
        {/* Fallback internal generic view */}
        {[1, 2, 3, 4].map((i) => (
          // ... existing fallback code if needed, but "인재검색" covers most cases.
          // Actually, since "인재검색" uses TalentSearchBoard, this part might only be reached by other categories like "지원자관리".
          // Let's keep the fallback for other categories for now.
          <div
            key={i}
            className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all bg-white group"
          >
            {/* ... keeping simplified fallback content ... */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">
                  P{i}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">익명 지원자 {i} (기타)</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* (선택 사항) 페이지 상단 텍스트가 필요 없다면 삭제하셔도 됩니다. */}
      <h1 className="text-4xl font-bold mb-4">기업 서비스 관리</h1>
      <p className="text-gray-600 mb-6">해당 카테고리의 데이터를 관리합니다.</p>

      {/* 2. 실제 웹사이트 프레임: w-screen을 통해 가로 배경을 꽉 채우되 내부를 다시 중앙 정렬합니다. */}
      <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden flex flex-col items-center">
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          {/* 2. 기업용 네비게이션이 정확히 위치함 */}
          <CompanyNavigation />

          <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <span
                className="cursor-pointer hover:text-gray-700"
                onClick={() => navigate("/CompanyLanding")}
              >
                기업홈
              </span>
              <span>/</span>
              <span>{decodedMenu}</span>
              <span>/</span>
              <span className={`${theme.textColor} font-bold`}>
                {decodedSub}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-8 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 ${theme.bgColor} ${theme.textColor} rounded-2xl flex items-center justify-center text-3xl shadow-inner`}
                  >
                    {theme.icon}
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                      {decodedSub}{" "}
                      <span className="text-gray-400 font-light hidden sm:inline">
                        | {decodedMenu}
                      </span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">
                      {theme.desc}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {decodedMenu === "공고관리" && (
                    <button
                      onClick={() => navigate("/company/post")}
                      className={`flex items-center gap-2 px-6 py-3 ${theme.accentColor} text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg`}
                    >
                      <FiPlus /> 새 공고 작성
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[500px] overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h3 className="font-bold text-gray-700">{decodedSub} 리스트</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiEye /> 실시간 데이터 업데이트 중
                </div>
              </div>
              {renderContent()}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default C_CategoryPage;
