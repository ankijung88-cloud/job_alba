import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiBriefcase, FiLock, FiArrowRight, FiUserPlus, FiHelpCircle, FiArrowLeft } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"USER" | "COMPANY">("USER");
  const [viewMode, setViewMode] = useState<"LOGIN" | "FIND_ID" | "FIND_PW">("LOGIN");

  const [form, setForm] = useState({
    id: "",
    password: "",
  });

  // Init Mock Data (Self-Healing)
  useEffect(() => {
    // 1. Ensure Default User
    const usersStr = localStorage.getItem("db_users");
    if (!usersStr) {
      const defaultUser = {
        "user": {
          id: "user",
          password: "user1234",
          name: "홍길동",
          phone: "010-1234-5678",
          email: "hong@test.com",
          role: "USER",
          memberNumber: "M240101-0001",
          nationality: "DOMESTIC",
          education: { level: "대졸", schoolName: "서울대학교", graduated: true },
          experiences: [],
          hasExperience: false,
          selfIntro: "성실한 인재입니다."
        }
      };
      localStorage.setItem("db_users", JSON.stringify(defaultUser));
    }

    // 2. Ensure Default Company
    const companiesStr = localStorage.getItem("db_companies");
    if (!companiesStr) {
      const defaultCompany = {
        "company": {
          id: "company",
          password: "company1234",
          companyName: "(주)테스트기업",
          regNumber: "123-45-67890",
          contactPerson: "김담당",
          description: "혁신적인 IT 기업입니다.",
          role: "COMPANY",
          memberNumber: "C240101-0001"
        }
      };
      localStorage.setItem("db_companies", JSON.stringify(defaultCompany));
    }
  }, []);

  // 찾기 폼 상태
  const [findForm, setFindForm] = useState({
    name: "",
    phone: "",
    companyName: "",
    regNumber: "",
    targetId: "", // 비번 찾기용 ID
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFindChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFindForm({ ...findForm, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.id || !form.password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    if (activeTab === "USER") {
      const usersStr = localStorage.getItem("db_users");
      const users = usersStr ? JSON.parse(usersStr) : {};
      const user = users[form.id];

      if (user && user.password === form.password) {
        localStorage.setItem("role", "USER");
        localStorage.setItem("userProfile", JSON.stringify(user));
        alert(`환영합니다, ${user.name}님!`);
        navigate("/UserLanding");
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    } else {
      const companiesStr = localStorage.getItem("db_companies");
      const companies = companiesStr ? JSON.parse(companiesStr) : {};
      const company = companies[form.id];

      if (company && company.password === form.password) {
        localStorage.setItem("role", "COMPANY");
        localStorage.setItem("companyProfile", JSON.stringify(company));
        alert(`환영합니다, ${company.companyName} 담당자님!`);
        navigate("/CompanyLanding");
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    }
  };

  const handleFindId = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "USER") {
      const usersStr = localStorage.getItem("db_users");
      const users = usersStr ? JSON.parse(usersStr) : {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const foundUser = Object.values(users).find((u: any) => u.name === findForm.name && u.phone === findForm.phone);

      if (foundUser) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert(`검색된 아이디는 [ ${(foundUser as any).id} ] 입니다.`);
        setViewMode("LOGIN");
      } else {
        alert("일치하는 회원 정보를 찾을 수 없습니다.");
      }
    } else {
      const companiesStr = localStorage.getItem("db_companies");
      const companies = companiesStr ? JSON.parse(companiesStr) : {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const foundCompany = Object.values(companies).find((c: any) => c.companyName === findForm.companyName && c.regNumber === findForm.regNumber);

      if (foundCompany) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert(`검색된 기업 아이디는 [ ${(foundCompany as any).id} ] 입니다.`);
        setViewMode("LOGIN");
      } else {
        alert("일치하는 기업 정보를 찾을 수 없습니다.");
      }
    }
  };

  const handleFindPw = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "USER") {
      const usersStr = localStorage.getItem("db_users");
      const users = usersStr ? JSON.parse(usersStr) : {};
      const user = users[findForm.targetId];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (user && (user as any).name === findForm.name && (user as any).phone === findForm.phone) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert(`회원님의 비밀번호는 [ ${(user as any).password} ] 입니다.`);
        setViewMode("LOGIN");
      } else {
        alert("정보가 일치하지 않습니다.");
      }
    } else {
      const companiesStr = localStorage.getItem("db_companies");
      const companies = companiesStr ? JSON.parse(companiesStr) : {};
      const company = companies[findForm.targetId];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (company && (company as any).companyName === findForm.companyName && (company as any).regNumber === findForm.regNumber) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert(`기업회원 비밀번호는 [ ${(company as any).password} ] 입니다.`);
        setViewMode("LOGIN");
      } else {
        alert("정보가 일치하지 않습니다.");
      }
    }
  };

  const handleResetData = () => {
    if (window.confirm("회원/기업 데이터를 초기화하시겠습니까?\n(기존 데이터가 삭제되고 테스트 계정이 생성됩니다.)")) {
      const defaultUser = {
        "user": {
          id: "user",
          password: "user1234",
          name: "홍길동",
          phone: "010-1234-5678",
          email: "hong@test.com",
          role: "USER",
          memberNumber: "M240101-0001",
          nationality: "DOMESTIC",
          education: { level: "대졸", schoolName: "서울대학교", graduated: true },
          experiences: [],
          hasExperience: false,
          selfIntro: "성실한 인재입니다."
        }
      };
      const defaultCompany = {
        "company": {
          id: "company",
          password: "company1234",
          companyName: "(주)테스트기업",
          regNumber: "123-45-67890",
          contactPerson: "김담당",
          description: "혁신적인 IT 기업입니다.",
          role: "COMPANY",
          memberNumber: "C240101-0001"
        }
      };
      localStorage.setItem("db_users", JSON.stringify(defaultUser));
      localStorage.setItem("db_companies", JSON.stringify(defaultCompany));
      alert("데이터가 초기화되었습니다.\n[개인] user / user1234\n[기업] company / company1234");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* 왼쪽: 브랜드 섹션 */}
        <div className="w-full md:w-5/12 bg-gray-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tighter mb-2 italic">JOB-ALBA</h1>
            <p className="text-gray-400 text-sm">Premium Job Matching Platform</p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold leading-tight">
                {activeTab === "USER"
                  ? "꿈꾸던 커리어의 시작,"
                  : "최고의 인재를 만나는 곳,"}
                <br />
                <span className="text-blue-500">JOB-ALBA</span>와 함께하세요.
              </h2>
            </div>
            {viewMode === "LOGIN" && (
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">New</div>
                  <span className="font-bold text-sm">계정 찾기 기능 오픈</span>
                </div>
                <p className="text-xs text-gray-400">아이디/비밀번호를 잊으셨나요?</p>
              </div>
            )}
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* 오른쪽: 폼 영역 */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">

          {/* 상단 탭 (로그인 모드일 때만 표시) */}
          {viewMode === "LOGIN" && (
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                onClick={() => setActiveTab("USER")}
                className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "USER"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <FiUser /> 개인
              </button>
              <button
                onClick={() => setActiveTab("COMPANY")}
                className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "COMPANY"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <FiBriefcase /> 기업
              </button>
            </div>
          )}

          {/* 모드별 컨텐츠 */}
          {viewMode === "LOGIN" && (
            <>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">아이디</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="id"
                      value={form.id}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                      placeholder="아이디를 입력하세요"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">비밀번호</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                      placeholder="비밀번호를 입력하세요"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 mt-6 bg-gray-900 text-white rounded-xl font-black text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  로그인 <FiArrowRight />
                </button>
              </form>

              <div className="mt-6 flex justify-center gap-4 text-xs text-gray-500 font-medium">
                <button onClick={() => setViewMode("FIND_ID")} className="hover:text-blue-600 transition-colors">아이디 찾기</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => setViewMode("FIND_PW")} className="hover:text-blue-600 transition-colors">비밀번호 찾기</button>
              </div>

              <div className="mt-8 text-center pt-8 border-t border-gray-100">
                <p className="text-gray-500 text-sm mb-4">계정이 없으신가요?</p>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full py-3 border-2 border-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <FiUserPlus /> 무료 회원가입하기
                </button>
                <button
                  onClick={handleResetData}
                  className="w-full mt-2 py-2 text-xs text-red-300 hover:text-red-500 transition-colors"
                >
                  * 데이터 초기화 (Reset Data)
                </button>
              </div>
            </>
          )}

          {viewMode === "FIND_ID" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setViewMode("LOGIN")} className="p-2 hover:bg-gray-100 rounded-full transition"><FiArrowLeft className="text-xl" /></button>
                <h3 className="text-xl font-bold">아이디 찾기 ({activeTab === "USER" ? "개인" : "기업"})</h3>
              </div>
              <form onSubmit={handleFindId} className="space-y-4">
                {activeTab === "USER" ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                      <input
                        type="text"
                        name="name"
                        value={findForm.name}
                        onChange={handleFindChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">연락처</label>
                      <input
                        type="text"
                        name="phone"
                        value={findForm.phone}
                        onChange={handleFindChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        placeholder="010-0000-0000"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">기업명</label>
                      <input
                        type="text"
                        name="companyName"
                        value={findForm.companyName}
                        onChange={handleFindChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">사업자등록번호</label>
                      <input
                        type="text"
                        name="regNumber"
                        value={findForm.regNumber}
                        onChange={handleFindChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        placeholder="000-00-00000"
                        required
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setViewMode("LOGIN")} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                    취소
                  </button>
                  <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg">
                    <FiHelpCircle /> 아이디 찾기
                  </button>
                </div>
              </form>
            </div>
          )}

          {viewMode === "FIND_PW" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setViewMode("LOGIN")} className="p-2 hover:bg-gray-100 rounded-full transition"><FiArrowLeft className="text-xl" /></button>
                <h3 className="text-xl font-bold">비밀번호 찾기 ({activeTab === "USER" ? "개인" : "기업"})</h3>
              </div>
              <form onSubmit={handleFindPw} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">아이디</label>
                  <input
                    type="text"
                    name="targetId"
                    value={findForm.targetId}
                    onChange={handleFindChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    required
                  />
                </div>
                {activeTab === "USER" ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                      <input
                        type="text"
                        name="name"
                        value={findForm.name}
                        onChange={handleFindChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">연락처</label>
                      <input
                        type="text"
                        name="phone"
                        value={findForm.phone}
                        onChange={handleFindChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        placeholder="010-0000-0000"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">기업명</label>
                      <input
                        type="text"
                        name="companyName"
                        value={findForm.companyName}
                        onChange={handleFindChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">사업자등록번호</label>
                      <input
                        type="text"
                        name="regNumber"
                        value={findForm.regNumber}
                        onChange={handleFindChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        placeholder="000-00-00000"
                        required
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setViewMode("LOGIN")} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                    취소
                  </button>
                  <button type="submit" className="flex-[2] py-4 bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg">
                    <FiLock /> 비밀번호 찾기
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
