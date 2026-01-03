import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiBriefcase, FiCheck, FiArrowLeft } from "react-icons/fi";

// User 및 Company 데이터 타입 정의 (Mock DB용)
interface UserAccount {
    id: string;
    password: string;
    name: string;
    phone: string;
    email: string;
    intro: string; // Short intro (one liner)
    role: "USER";
    memberNumber?: string; // 고유 회원번호
    // New Fields
    address: string; // Current residence address
    nationality: "DOMESTIC" | "FOREIGNER";
    visaType?: string;
    visaPhoto?: string; // Base64
    profilePhoto?: string; // Base64
    education: {
        level: string; // 고졸, 대졸 등
        schoolName: string;
        graduated: boolean;
    };
    experiences: {
        companyName: string;
        duration: string;
        position: string;
    }[];
    hasExperience: boolean; // Flag to easily check if they have any
    selfIntro: string; // Detailed intro
}

interface CompanyAccount {
    id: string;
    password: string;
    companyName: string;
    regNumber: string;
    contactPerson: string;
    description: string;
    role: "COMPANY";
    memberNumber?: string; // 고유 회원번호
}

function Signup() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"USER" | "COMPANY">("USER");

    const [form, setForm] = useState({
        id: "",
        password: "",
        confirmPassword: "",
        // 개인
        name: "",
        phone: "",
        email: "",
        intro: "",
        // 기업
        companyName: "",
        regNumber: "",
        contactPerson: "",
        description: "",
        // New User Fields
        address: "",
        nationality: "DOMESTIC",
        visaType: "E-9 (비전문취업)",
        eduLevel: "고졸",
        schoolName: "",
        hasExperience: "false", // radio value
        // Experience List (Max 5)
        experienceList: [] as { companyName: string; duration: string; position: string }[],
        // Temp fields for adding new experience
        tempExpCompany: "",
        tempExpDuration: "",
        tempExpPosition: "",

        selfIntro: "",
    });

    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [visaPhoto, setVisaPhoto] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "PROFILE" | "VISA") => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === "PROFILE") setProfilePhoto(reader.result as string);
                else setVisaPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addExperience = () => {
        if (form.experienceList.length >= 5) {
            alert("경력사항은 최대 5개까지 입력 가능합니다.");
            return;
        }
        if (!form.tempExpCompany || !form.tempExpPosition || !form.tempExpDuration) {
            alert("회사명, 직급, 근무기간을 모두 입력해주세요.");
            return;
        }
        const newExp = {
            companyName: form.tempExpCompany,
            position: form.tempExpPosition,
            duration: form.tempExpDuration
        };
        setForm({
            ...form,
            experienceList: [...form.experienceList, newExp],
            tempExpCompany: "",
            tempExpPosition: "",
            tempExpDuration: ""
        });
    };

    const removeExperience = (index: number) => {
        const newList = form.experienceList.filter((_, i) => i !== index);
        setForm({ ...form, experienceList: newList });
    };

    const generateMemberNumber = () => {
        const date = new Date();
        const dateStr = date.getFullYear().toString().slice(2) + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `M${dateStr}-${random}`;
    };

    const validatePassword = (pwd: string) => {
        // 12자 이상, 대문자, 소문자, 숫자, 특수문자 포함
        const hasUpper = /[A-Z]/.test(pwd);
        const hasLower = /[a-z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        return pwd.length >= 12 && hasUpper && hasLower && hasNumber && hasSpecial;
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. 유효성 검사
        if (!form.id || !form.password) {
            alert("아이디와 비밀번호는 필수입니다.");
            return;
        }

        if (!validatePassword(form.password)) {
            alert("비밀번호는 총 12자 이상이어야 하며, 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (activeTab === "USER") {
            if (!form.name || !form.phone) {
                alert("이름과 연락처는 필수입니다.");
                return;
            }

            // 2. 통합 중복 ID 검사 (Global Unique Check)
            const usersStr = localStorage.getItem("db_users");
            const companiesStr = localStorage.getItem("db_companies");
            const users = usersStr ? JSON.parse(usersStr) : {};
            const companies = companiesStr ? JSON.parse(companiesStr) : {};

            if (users[form.id] || companies[form.id]) {
                alert("이미 존재하는 아이디입니다. (통합 중복 확인)");
                return;
            }

            const memberNumber = generateMemberNumber();

            // 3. 저장
            const newUser: UserAccount = {
                id: form.id,
                password: form.password,
                name: form.name,
                phone: form.phone,
                email: form.email,
                intro: form.intro,
                role: "USER",
                memberNumber: memberNumber, // Save Member Number
                address: form.address,
                nationality: form.nationality as "DOMESTIC" | "FOREIGNER",
                visaType: form.nationality === "FOREIGNER" ? form.visaType : undefined,
                visaPhoto: form.nationality === "FOREIGNER" && visaPhoto ? visaPhoto : undefined,
                profilePhoto: profilePhoto || undefined,
                education: {
                    level: form.eduLevel,
                    schoolName: form.schoolName,
                    graduated: true, // simplified
                },
                experiences: form.hasExperience === "true" ? form.experienceList : [],
                hasExperience: form.hasExperience === "true",
                selfIntro: form.selfIntro,
            };

            users[form.id] = newUser;
            localStorage.setItem("db_users", JSON.stringify(users));

            alert(`회원가입이 완료되었습니다!\n회원번호: ${memberNumber}\n로그인해주세요.`);
            navigate("/");

        } else {
            if (!form.companyName || !form.regNumber) {
                alert("기업명과 사업자등록번호는 필수입니다.");
                return;
            }

            // 2. 통합 중복 ID 검사
            const usersStr = localStorage.getItem("db_users");
            const companiesStr = localStorage.getItem("db_companies");
            const users = usersStr ? JSON.parse(usersStr) : {};
            const companies = companiesStr ? JSON.parse(companiesStr) : {};

            if (users[form.id] || companies[form.id]) {
                alert("이미 존재하는 아이디입니다. (통합 중복 확인)");
                return;
            }

            const memberNumber = generateMemberNumber();

            // 3. 저장
            const newCompany: CompanyAccount = {
                id: form.id,
                password: form.password,
                companyName: form.companyName,
                regNumber: form.regNumber,
                contactPerson: form.contactPerson,
                description: form.description,
                role: "COMPANY",
                memberNumber: memberNumber
            };

            companies[form.id] = newCompany;
            localStorage.setItem("db_companies", JSON.stringify(companies));

            alert(`기업 회원가입이 완료되었습니다!\n회원번호: ${memberNumber}\n로그인해주세요.`);
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black italic mb-2">Join JOB-ALBA</h1>
                    <p className="text-gray-500">
                        {activeTab === "USER" ? "개인 회원가입" : "기업 회원가입"}
                    </p>
                </div>

                <div className="flex bg-gray-100 rounded-full p-1.5 mb-8">
                    <button
                        onClick={() => setActiveTab("USER")}
                        className={`flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "USER"
                            ? "bg-white text-blue-600 shadow-md ring-1 ring-black/5"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            } `}
                    >
                        <FiUser className={activeTab === "USER" ? "text-blue-600" : ""} /> 개인 회원
                    </button>
                    <button
                        onClick={() => setActiveTab("COMPANY")}
                        className={`flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "COMPANY"
                            ? "bg-white text-blue-600 shadow-md ring-1 ring-black/5"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            } `}
                    >
                        <FiBriefcase className={activeTab === "COMPANY" ? "text-blue-600" : ""} /> 기업 회원
                    </button>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    {/* 공통 필드 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">아이디</label>
                        <input
                            type="text"
                            name="id"
                            value={form.id}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="아이디 입력"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">비밀번호</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="12자 이상(대/소문자, 숫자, 특수문자)"
                                required
                            />
                            <p className="text-[10px] text-gray-400 mt-1 pl-1">
                                ※ 12자 이상, 대문자+소문자+숫자+특수문자 조합
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">비밀번호 확인</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="비밀번호 확인"
                                required
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100 my-6" />

                    {activeTab === "USER" ? (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="본명"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">연락처</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="010-0000-0000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">이메일</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="example@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">한줄 소개</label>
                                <input
                                    type="text"
                                    name="intro"
                                    value={form.intro}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="자신을 소개해주세요"
                                />
                            </div>

                            {/* --- 구분선 --- */}
                            <div className="col-span-full border-t border-gray-100 my-4 pt-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">상세 이력 정보</h3>
                            </div>

                            {/* 1. 국적 및 비자 */}


                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">국적 구분</label>
                                <select
                                    name="nationality"
                                    value={form.nationality}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="DOMESTIC">내국인 (Korean)</option>
                                    <option value="FOREIGNER">외국인 (Foreigner)</option>
                                </select>
                            </div>

                            {/* 비자 정보 (외국인일 경우) */}
                            {form.nationality === "FOREIGNER" && (
                                <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">보유 비자 (Visa Type)</label>
                                        <select
                                            name="visaType"
                                            value={form.visaType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="E-9 (비전문취업)">E-9 (비전문취업)</option>
                                            <option value="H-2 (방문취업)">H-2 (방문취업)</option>
                                            <option value="F-4 (재외동포)">F-4 (재외동포)</option>
                                            <option value="F-5 (영주권)">F-5 (영주권)</option>
                                            <option value="F-6 (결혼이민)">F-6 (결혼이민)</option>
                                            <option value="D-2 (유학)">D-2 (유학)</option>
                                            <option value="D-10 (구직)">D-10 (구직)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">외국인등록증 사진 (Alien Registration Card)</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="visaPhotoInput"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, "VISA")}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="visaPhotoInput"
                                                className="flex items-center w-full px-4 py-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold mr-3">Choose File</span>
                                                <span className="text-gray-500 text-sm">{visaPhoto ? "파일이 선택되었습니다" : "No file chosen"}</span>
                                            </label>
                                        </div>
                                        {visaPhoto && (
                                            <div className="mt-2">
                                                <img src={visaPhoto} alt="Visa Preview" className="h-24 w-auto rounded-md border border-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 2. 증명사진 */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">얼굴사진(증명사진)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="profilePhotoInput"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, "PROFILE")}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="profilePhotoInput"
                                        className="flex items-center w-full px-4 py-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold mr-3">Choose File</span>
                                        <span className="text-gray-500 text-sm">{profilePhoto ? "파일이 선택되었습니다" : "No file chosen"}</span>
                                    </label>
                                </div>
                                {profilePhoto && (
                                    <div className="mt-2">
                                        <img src={profilePhoto} alt="Profile Preview" className="h-24 w-24 object-cover rounded-full border border-gray-300" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfilePhoto(null);
                                        // Optional: Reset file input value if needed, though hidden
                                        const fileInput = document.getElementById("profilePhotoInput") as HTMLInputElement;
                                        if (fileInput) fileInput.value = "";
                                    }}
                                    className="text-xs text-gray-400 mt-2 hover:text-gray-600 underline"
                                >
                                    사진 미등록 (이미지 없이 가입 진행)
                                </button>
                            </div>

                            {/* 3. 주소 및 학력 */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">현재 거주지 주소</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="시/구/동 까지 입력해주세요 (예: 서울시 강남구 역삼동)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">최종 학력</label>
                                <div className="flex gap-2">
                                    <select
                                        name="eduLevel"
                                        value={form.eduLevel}
                                        onChange={handleChange}
                                        className="w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                    >
                                        <option value="고졸">고졸</option>
                                        <option value="초대졸">초대졸</option>
                                        <option value="대졸">대졸</option>
                                        <option value="석사 이상">석사 이상</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="schoolName"
                                        value={form.schoolName}
                                        onChange={handleChange}
                                        className="w-2/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                        placeholder="학교명 (선택)"
                                    />
                                </div>
                            </div>

                            {/* 4. 경력 */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">경력 사항</label>
                                <div className="flex gap-4 mb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="hasExperience"
                                            value="false"
                                            checked={form.hasExperience === "false"}
                                            onChange={handleChange}
                                        />
                                        <span>신입 (경력 없음)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="hasExperience"
                                            value="true"
                                            checked={form.hasExperience === "true"}
                                            onChange={handleChange}
                                        />
                                        <span>경력 보유</span>
                                    </label>
                                </div>
                                {form.hasExperience === "true" && (
                                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {/* Existing List */}
                                        {form.experienceList.map((exp, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                                <div>
                                                    <div className="font-bold text-sm text-gray-800">{exp.companyName}</div>
                                                    <div className="text-xs text-gray-500">{exp.position} | {exp.duration}</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExperience(idx)}
                                                    className="text-red-500 text-xs font-bold hover:underline"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        ))}

                                        {/* Add New Input */}
                                        {form.experienceList.length < 5 ? (
                                            <div className="space-y-2 mt-2">
                                                <input
                                                    type="text"
                                                    name="tempExpCompany"
                                                    value={form.tempExpCompany}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm"
                                                    placeholder="회사명"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        name="tempExpPosition"
                                                        value={form.tempExpPosition}
                                                        onChange={handleChange}
                                                        className="w-1/2 px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm"
                                                        placeholder="직급/역할"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="tempExpDuration"
                                                        value={form.tempExpDuration}
                                                        onChange={handleChange}
                                                        className="w-1/2 px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm"
                                                        placeholder="근무 기간"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addExperience}
                                                    className="w-full py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors"
                                                >
                                                    + 경력 추가하기 ({form.experienceList.length}/5)
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center text-xs text-gray-400 py-2">
                                                최대 5개의 경력 사항을 모두 입력했습니다.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 5. 자기소개서 */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">자기소개서</label>
                                <textarea
                                    name="selfIntro"
                                    value={form.selfIntro}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none h-32 resize-none"
                                    placeholder="자신의 강점, 성격, 업무 경험 등을 자유롭게 작성해주세요."
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
                                    value={form.companyName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="상호명"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">사업자등록번호</label>
                                <input
                                    type="text"
                                    name="regNumber"
                                    value={form.regNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="000-00-00000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">담당자명</label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={form.contactPerson}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="담당자 성함"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">기업 소개</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="기업 소개"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 mt-8 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <FiCheck /> 회원가입 완료
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-gray-500 font-bold hover:text-gray-900 flex items-center justify-center gap-2 mx-auto"
                    >
                        <FiArrowLeft /> 로그인 화면으로 돌아가기
                    </button>
                </div>
            </div>
        </div >
    );
}

export default Signup;
